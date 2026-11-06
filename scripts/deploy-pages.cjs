// Use the same authenticated Pages API as actions/deploy-pages, but allow slow
// server-side synchronization to finish beyond that action's ten-minute cutoff.
module.exports = async function deployPages({
  github,
  context,
  core,
  now = Date.now,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  timeoutMs = 30 * 60 * 1000,
}) {
  const artifacts = await github.paginate(
    github.rest.actions.listWorkflowRunArtifacts,
    { ...context.repo, run_id: context.runId, per_page: 100 },
  );
  const matches = artifacts.filter(
    (artifact) => artifact.name === "github-pages" && !artifact.expired,
  );
  if (matches.length !== 1) {
    throw new Error(
      `Expected one github-pages artifact; found ${matches.length}.`,
    );
  }

  const token = await core.getIDToken();
  const { data: deployment } = await github.request(
    "POST /repos/{owner}/{repo}/pages/deployments",
    {
      ...context.repo,
      artifact_id: matches[0].id,
      pages_build_version: context.sha,
      oidc_token: token,
    },
  );
  if (!deployment.id) throw new Error("Pages did not return a deployment ID.");
  core.setOutput("deployment_id", String(deployment.id));
  core.setOutput("page_url", deployment.page_url);
  core.info(`Created Pages deployment ${deployment.id}.`);

  const deadline = now() + timeoutMs;
  const failed = new Set([
    "deployment_failed",
    "deployment_content_failed",
    "deployment_cancelled",
    "deployment_lost",
  ]);
  let errors = 0;
  let previousStatus;
  while (now() < deadline) {
    let status;
    try {
      const { data } = await github.request(
        "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}",
        { ...context.repo, pages_deployment_id: deployment.id },
      );
      status = data.status;
      errors = 0;
    } catch (error) {
      if (
        ![404, 429, 500, 502, 503, 504].includes(error.status) ||
        ++errors > 5
      ) {
        throw new Error(
          `Pages status request failed (HTTP ${error.status ?? "unknown"}).`,
        );
      }
      core.warning(
        `Transient Pages status error (HTTP ${error.status}); retrying.`,
      );
    }
    if (status !== previousStatus && status) {
      core.info(`Pages deployment status: ${status}`);
      previousStatus = status;
    }
    if (status === "succeed") {
      core.info("Pages deployment completed successfully.");
      return;
    }
    if (failed.has(status))
      throw new Error(`Pages deployment failed: ${status}.`);
    await sleep(Math.min(30000, Math.max(0, deadline - now())));
  }
  throw new Error(
    `Pages deployment did not finish within ${timeoutMs / 60000} minutes (last status: ${previousStatus ?? "unknown"}).`,
  );
};
