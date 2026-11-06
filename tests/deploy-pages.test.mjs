import { test } from "node:test";
import assert from "node:assert/strict";
import deployPages from "../scripts/deploy-pages.cjs";

function fixture({ statuses = ["succeed"], artifacts } = {}) {
  let elapsed = 0;
  let checks = 0;
  let creations = 0;
  const outputs = {};
  return {
    outputs,
    get creations() {
      return creations;
    },
    get elapsed() {
      return elapsed;
    },
    options: {
      context: {
        repo: { owner: "lab", repo: "site" },
        sha: "commit",
        runId: 1,
      },
      core: {
        getIDToken: async () => "test-token",
        setOutput: (key, value) => {
          outputs[key] = value;
        },
        info() {},
        warning() {},
      },
      github: {
        rest: { actions: { listWorkflowRunArtifacts() {} } },
        paginate: async () => artifacts ?? [{ name: "github-pages", id: 2 }],
        request: async (route) => {
          if (route.startsWith("POST")) {
            creations++;
            return {
              data: { id: "deployment", page_url: "https://lab.github.io" },
            };
          }
          const status = statuses[Math.min(checks++, statuses.length - 1)];
          if (status instanceof Error) throw status;
          return { data: { status } };
        },
      },
      now: () => elapsed,
      sleep: async (ms) => {
        elapsed += ms;
      },
    },
  };
}

test("Pages can finish after the stock action's ten-minute cutoff", async () => {
  const run = fixture({
    statuses: [...Array(24).fill("syncing_files"), "succeed"],
  });
  await deployPages(run.options);
  assert.equal(run.elapsed, 12 * 60 * 1000);
  assert.equal(run.creations, 1);
  assert.equal(run.outputs.deployment_id, "deployment");
  assert.equal(run.outputs.page_url, "https://lab.github.io");
});

test("Pages polling remains bounded and exposes the ID needed for cleanup", async () => {
  const run = fixture({ statuses: ["deployment_queued"] });
  await assert.rejects(
    deployPages({ ...run.options, timeoutMs: 60000 }),
    /did not finish/,
  );
  assert.equal(run.elapsed, 60000);
  assert.equal(run.outputs.deployment_id, "deployment");
});

test("Pages rejects ambiguous or expired artifacts before creating a deployment", async () => {
  for (const artifacts of [
    [],
    [{ name: "github-pages", id: 1, expired: true }],
    [
      { name: "github-pages", id: 1 },
      { name: "github-pages", id: 2 },
    ],
  ]) {
    const run = fixture({ artifacts });
    await assert.rejects(deployPages(run.options), /Expected one/);
    assert.equal(run.creations, 0);
  }
});

test("Pages stops immediately on a permanent deployment failure", async () => {
  const run = fixture({ statuses: ["deployment_content_failed"] });
  await assert.rejects(deployPages(run.options), /deployment_content_failed/);
  assert.equal(run.elapsed, 0);
});

test("Pages retries transient status errors without creating another deployment", async () => {
  const run = fixture({
    statuses: [Object.assign(new Error(), { status: 503 }), "succeed"],
  });
  await deployPages(run.options);
  assert.equal(run.elapsed, 30000);
  assert.equal(run.creations, 1);
});

test("Pages does not retry authorization errors or unlimited transient failures", async () => {
  for (const status of [403, 503]) {
    const run = fixture({ statuses: [Object.assign(new Error(), { status })] });
    await assert.rejects(
      deployPages(run.options),
      new RegExp(`HTTP ${status}`),
    );
    assert.ok(run.elapsed <= 150000);
  }
});
