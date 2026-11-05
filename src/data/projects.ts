export const researchProjects = [
  {
    id: "momentum",
    name: "Momentum",
    stage: "Research foundation",
    title: "How learning and mood shape each other",
    summary:
      "Our experiences influence how we feel—and how we feel may change what we learn. Momentum follows these reciprocal processes in everyday life.",
    introduction:
      "Momentum investigates how sensitivity to rewards and negative outcomes changes over time, how those changes relate to later mood, and why these relationships differ across people. By studying the same people across several weeks, we connect learning experiments with the experiences and emotions of daily life.",
    questions: [
      "How does mood change the way people learn from rewards and negative outcomes?",
      "Do changes in learning precede changes in mood over the following days?",
      "Why do learning and mood influence each other more strongly in some people than in others?",
    ],
    methods:
      "Repeated learning experiments measure how people update their expectations and value different outcomes. Smartphone assessments capture everyday mood and experiences, while wearable recordings of brain and heart activity help us examine the physiological processes involved.",
    approach:
      "Computational reinforcement learning models describe how people learn from experience. Intensive longitudinal models then connect changes in learning with changes in mood within the same person, while examining how these relationships vary across people.",
    connection:
      "Momentum provides the scientific and methodological foundation for LENS. LENS extends the learning–mood question to adults in midlife, asking whether heightened sensitivity to negative outcomes helps explain the emergence of suicidal thoughts.",
    companion: "lens",
    companionLabel: "Explore the upcoming LENS study",
    themes: ["learning", "emotion", "personality"],
    papers: ["cv-080", "cv-104"],
  },
  {
    id: "lens",
    name: "LENS",
    stage: "Upcoming study",
    title: "Learning states and the emergence of suicidal thoughts",
    summary:
      "Building on Momentum, LENS will ask whether changes in learning from negative outcomes help explain when emotional distress and suicidal thoughts emerge.",
    introduction:
      "When do everyday setbacks become especially difficult to navigate? LENS will investigate whether heightened sensitivity to negative outcomes precedes increases in emotional distress and suicidal thoughts. The study focuses on how vulnerability changes within a person over time, alongside differences in personality and history of suicidal behavior.",
    questions: [
      "Do states of heightened punishment learning precede increases in suicidal thoughts, and what role does negative mood play?",
      "Can brain and heart responses during learning help characterize these changing states?",
      "Do stressful experiences have greater emotional impact during these states, and how do these relationships differ with negative affectivity and suicide-attempt history?",
    ],
    methods:
      "The planned study will combine repeated daily learning experiments with smartphone assessments of mood, suicidal thoughts, and everyday experiences in adults in midlife. Wearable electroencephalography (EEG) and heart recordings will measure physiological responses during learning.",
    approach:
      "Computational models will estimate how sensitivity to rewards and punishments changes from day to day. Longitudinal analyses will test how these learning states relate to later mood and suicidal thoughts, and whether they alter the impact of stressful experiences.",
    connection:
      "Momentum examines the reciprocal relationship between learning and mood. LENS builds directly on that work to ask whether learning states help explain periods of vulnerability to suicidal thoughts—and why the same stressor may affect a person differently at different times.",
    companion: "momentum",
    companionLabel: "Explore the Momentum foundation",
    themes: ["learning", "emotion", "personality"],
    papers: ["cv-097", "cv-080", "cv-104"],
  },
];
