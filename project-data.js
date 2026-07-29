window.PROJECT_ORDER = ['go2', 'xarm', 'world3d', 'eval', 'photos', 'degree', 'pinecone', 'avian'];

window.PROJECTS = {
  go2: {
    title: 'Persistent Semantic Navigation for Unitree Go2',
    short: 'A ROS 2 teach-and-resume stack that preserves maps and named places, restores localization after restart, and exposes semantic navigation through constrained, auditable tools.',
    image: 'assets/images/go2-navigation-poster.jpg',
    category: 'Embodied AI · Autonomous Robotics',
    year: '2025–Present',
    role: 'Research assistant · System architect',
    readingTime: '11 min read',
    github: 'https://github.com/pateldhruv1672/go2_ros',
    stack: ['ROS 2 Jazzy', 'Nav2', 'SLAM Toolbox', 'Cartographer', 'AMCL', 'LangGraph', 'OpenRouter VLM', 'Python', 'C++', 'Unitree SDK'],
    facts: [
      { label: 'Operating modes', value: 'Base · Teach · Resume' },
      { label: 'Persistent artifacts', value: 'Map · Places · Session metadata' },
      { label: 'Primary interface', value: 'Nav2 actions + ROS 2 topics' }
    ],
    lead: 'This project is about the part of autonomy that usually gets hidden by a successful demo: preserving spatial memory, recovering a valid pose after restart, keeping the ROS graph healthy, and turning a human place name into a navigation goal without letting an LLM directly control the robot.',
    problem: 'A quadruped can traverse a hallway once and still be unusable the next morning. Real deployment means processes restart, transforms become stale, SLAM and localization can accidentally publish competing map frames, and semantic labels can drift away from the metric map that gave them meaning. I designed the stack around persistence, observability, and bounded recovery rather than treating them as post-demo polish.',
    chapters: [
      {
        title: 'The reliability boundary comes before the agent',
        paragraphs: [
          'The repository deliberately separates base robot bring-up from experimental overlays. Base mode owns the driver and sensor pipeline. Teach mode owns SLAM. Resume mode owns Nav2 localization and execution. The semantic and voice layers start only after the underlying graph is healthy.',
          'That separation prevents the most common failure in research robotics: launching a second SLAM, Nav2, RViz, or TF publisher from an “all-in-one” script and then debugging symptoms several layers above the actual fault.'
        ],
        bullets: [
          'CycloneDDS, a fixed ROS domain, and a workspace virtual environment make discovery and Python dependencies repeatable.',
          'Every navigation goal is sent in the map frame; empty or ambiguous frame IDs are rejected.',
          'Lifecycle state, action availability, sensor freshness, and TF ownership are checked before semantic execution starts.'
        ]
      },
      {
        title: 'Teach mode converts a building into persistent robot memory',
        paragraphs: [
          'During teaching, the robot builds an occupancy map while a semantic layer records named places. Labels can be entered manually or proposed from camera observations by a VLM, but the saved representation remains anchored to the metric map.',
          'A session is not considered complete until the map image, map metadata, semantic places, and session metadata are written together. This gives every future resume attempt one explicit unit of state rather than a collection of unrelated files.'
        ],
        bullets: [
          'map.yaml and map.pgm preserve the metric map.',
          'places.yaml stores human-meaningful locations associated with map coordinates.',
          'session.yaml records the session identity and supporting metadata.',
          'A persistent spawn reference provides a known semantic origin for later recovery.'
        ]
      },
      {
        title: 'Resume mode restores context before it enables motion',
        paragraphs: [
          'On resume, the system selects a saved session, starts localization against that map, and waits for a valid transform chain. Navigation is enabled only after the robot has a credible pose and the relevant Nav2 actions are available.',
          'If a session is incomplete, the launcher can fall back to a live map, but it avoids the unsafe case where SLAM and AMCL both attempt to own map-to-odom. The semantic node can also rehydrate missing place labels from shared memory after restart.'
        ]
      },
      {
        title: 'Language is routed through tools, not into velocity commands',
        paragraphs: [
          'The agentic layer is structured as an orchestrator, planner, and ROS-connected executors. A high-level request is decomposed, grounded to a known semantic place, converted into geometric waypoints, and finally submitted through Nav2.',
          'The language model never receives an unrestricted path to cmd_vel. It can select and sequence typed tools whose preconditions, arguments, and outputs are visible. That makes the behavior easier to inspect and safer to extend with recovery and human confirmation.'
        ]
      },
      {
        title: 'Debuggability is part of the architecture',
        paragraphs: [
          'The repository documents clean-restart procedures, lifecycle checks, topic and action inspection, and the launch order required to avoid duplicate publishers. These details are not incidental; they are what make repeated real-robot experiments possible.',
          'The same philosophy carries into simulation. The simulator is expected to mirror the real topic contract for camera, LiDAR, odometry, transforms, and velocity commands so that higher-level semantic and agent code does not fork into a second implementation.'
        ]
      }
    ],
    system: [
      'Unitree driver and sensor pipeline publish the real robot contract: LiDAR, camera, IMU, odometry, joint state, TF, and command velocity.',
      'Teach mode runs one SLAM owner, captures the map, and writes semantic place observations into a named session.',
      'Resume mode runs one localization owner, validates the map-to-odom chain, and brings Nav2 lifecycle nodes to an executable state.',
      'A memory layer resolves human place names to map-grounded locations and keeps the selected session explicit.',
      'An orchestrator and planner call typed navigation tools; executors submit goals, observe feedback, and trigger bounded recovery.',
      'RViz and logs expose maps, paths, markers, lifecycle state, and failure evidence for repeatable experiments.'
    ],
    unique: 'The differentiator is not “LLM + robot.” It is the decision to make persistence, TF ownership, session integrity, and tool boundaries the foundation on which language interaction is allowed to operate.',
    impact: [
      'Created a repeatable teach/resume workflow instead of rebuilding maps and semantic locations for every run.',
      'Grounded human requests such as “go to the lab bench” in saved metric state rather than brittle hard-coded command strings.',
      'Reduced debugging ambiguity by separating robot bring-up, SLAM, localization, Nav2, semantic memory, and agent overlays.',
      'Established a real/simulation interface contract that supports future ablations, recovery studies, and human-facing tour scenarios.'
    ],
    gallery: [
      { src: 'assets/images/go2-navigation-poster.jpg', alt: 'Unitree Go2 traversing the SJSU Robotics and Digital Twin Lab during a navigation run', caption: 'Reviewed frame from the autonomous navigation recording.', kind: 'landscape' },
      { src: 'assets/images/go2-motion-poster.jpg', alt: 'Unitree Go2 executing a motion skill in the laboratory', caption: 'Reviewed frame from the Go2 motion-skills recording.', kind: 'landscape' },
      { src: 'assets/images/go2-lab.webp', alt: 'Unitree G1 and Go2 robots inside the SJSU Robotics and Digital Twin Lab', caption: 'The real hardware environment used for autonomy experiments.', kind: 'landscape' },
      { src: 'assets/images/lab/20260526_203953.webp', alt: 'Unitree robots and workstations in the SJSU robotics laboratory', caption: 'Go2, G1, and manipulation platforms share the same research space.', kind: 'landscape' },
      { src: 'assets/images/lab/20260526_203526.webp', alt: 'Unitree Go2 quadruped in front of laboratory workstations', caption: 'Go2 during lab bring-up and sensor validation.', kind: 'landscape' },
      { src: 'assets/images/lab/20260526_204036.webp', alt: 'Unitree Go2 and G1 robots in the robotics laboratory', caption: 'Physical AI experiments are validated on real platforms, not only in simulation.', kind: 'portrait' }
    ],
    videos: [
      { src: 'assets/media/go2-navigation-highlight.mp4', poster: 'assets/images/go2-navigation-poster.jpg', label: 'Go2 autonomous navigation', duration: '18 sec', caption: 'Reviewed segment from the uploaded navigation run, showing the robot moving through the lab while the ROS 2 navigation stack is active.' },
      { src: 'assets/media/go2-motion-skills-highlight.mp4', poster: 'assets/images/go2-motion-poster.jpg', label: 'Go2 motion skills', duration: '20 sec', caption: 'Reviewed hardware segment showing the quadruped executing motion behaviors in the SJSU lab.' }
    ]
  },

  xarm: {
    title: 'xArm Teleoperation, Perception & Demonstration Learning',
    short: 'A real-to-sim manipulation workflow connecting VR teleoperation, synchronized RGB-D perception, gripper actions, structured demonstration data, and Isaac Sim.',
    image: 'assets/images/xarm-teleop-poster.jpg',
    category: 'Robot Learning · Manipulation',
    year: '2026–Present',
    role: 'Research assistant · Robotics engineer',
    readingTime: '12 min read',
    github: null,
    stack: ['ROS 2', 'xArm SDK', 'Isaac Sim', 'PyTorch', 'Behavior Cloning', 'RGB-D', 'WebRTC', 'OpenCV', 'Python', 'C++'],
    facts: [
      { label: 'Backends', value: 'Real xArm + Isaac Sim' },
      { label: 'Observations', value: 'RGB · Depth · Segmentation · Robot state' },
      { label: 'Output', value: 'Filtered demonstration episodes' }
    ],
    lead: 'The goal is not merely to move a robot arm from a VR controller. The useful research artifact is a synchronized episode in which commands, joint state, gripper state, visual observations, and timing can be inspected, filtered, replayed, and used to train a policy.',
    problem: 'Manipulation learning breaks when demonstrations are visually impressive but structurally inconsistent. Camera frames arrive on a different clock from robot state, gripper events are not aligned with contact, failed trials pollute the dataset, and simulation uses a control contract that does not match hardware. This project builds the data and control path as one system.',
    chapters: [
      {
        title: 'One control contract across hardware and simulation',
        paragraphs: [
          'The physical xArm remains the reference backend. Commands, joint state, end-effector state, and perception are exposed through ROS 2 interfaces that can be mirrored in Isaac Sim. This keeps teleoperation and replay logic from splitting into unrelated real and simulated implementations.',
          'The Isaac clip in this portfolio preserves the portrait recording in a 16:9 canvas rather than cropping out the controller or robot. It shows the human input and simulated arm response in the same frame.'
        ]
      },
      {
        title: 'Teleoperation is treated as data acquisition',
        paragraphs: [
          'Each run records the state required to reconstruct what happened: joint trajectories, operator commands, gripper transitions, timestamps, and camera observations. Episodes can be accepted, rejected, or annotated before training.',
          'That quality gate matters more than collecting maximum volume. A smaller set of temporally aligned, successful demonstrations is more useful for behavior cloning than a large directory of videos with no state correspondence.'
        ],
        bullets: [
          'Explicit episode boundaries prevent adjacent trials from leaking into one training sample.',
          'Robot and camera timestamps are retained so action-observation alignment can be audited.',
          'Gripper/no-gripper sequences are stored as distinct behaviors instead of inferred later from video.'
        ]
      },
      {
        title: 'Perception is visible and debuggable',
        paragraphs: [
          'The RGB-D dashboard combines the live color stream, depth, segmentation, robot controls, and IMU information. A separate multiview feed shows raw and processed camera views together.',
          'This is useful because many apparent “policy” failures are actually perception or calibration failures. Seeing the streams side by side makes it possible to separate missing depth, segmentation errors, camera latency, and control problems before retraining a model.'
        ]
      },
      {
        title: 'Behavior cloning is evaluated as a sim-to-real loop',
        paragraphs: [
          'Demonstrations feed behavior-cloning experiments in Isaac Sim. Domain randomization over object pose, lighting, and contact parameters is used to expose sensitivity before hardware deployment.',
          'Failures are categorized and returned to the data pipeline: collect a missing behavior, reject a bad episode, adjust a randomization range, or change an interface. The loop is designed to improve the system rather than produce one cherry-picked grasp.'
        ]
      },
      {
        title: 'Why the workflow is different from a teleop demo',
        paragraphs: [
          'A teleop demo ends when the arm follows the operator. This system continues through episode validation, training, replay, and real/sim comparison. The same clips that communicate the project also correspond to concrete stages of that pipeline: physical control, simulated control, RGB-D observability, and multiview perception.'
        ]
      }
    ],
    system: [
      'VR or operator input is converted into bounded end-effector/joint commands rather than sent as an unchecked raw device stream.',
      'The xArm driver executes commands and publishes robot state, while gripper events remain explicit in the episode timeline.',
      'RGB-D and segmentation services expose synchronized visual context for debugging and learning.',
      'A recorder writes robot state, actions, and observations into structured episodes with validation metadata.',
      'Isaac Sim mirrors the interface for replay, behavior cloning, domain randomization, and failure analysis.',
      'Reviewed episodes and evaluation results feed the next data-collection iteration.'
    ],
    unique: 'The project joins teleoperation, observability, data quality, simulation, and policy learning into one research loop. The videos are mapped to those actual subsystems rather than being used as interchangeable robotics footage.',
    impact: [
      'Produced short, reviewable demonstrations for real xArm motion, gripping, Isaac teleoperation, RGB-D integration, and multiview perception.',
      'Created a reusable episode structure for imitation-learning experiments rather than relying on raw recordings.',
      'Made perception and timing failures visible before they are misdiagnosed as model failures.',
      'Established a practical path for comparing simulated behavior with hardware execution.'
    ],
    gallery: [
      { src: 'assets/images/xarm-lab.webp', alt: 'Two xArm robots and perception equipment on a laboratory workbench', caption: 'The dual-arm workbench used for manipulation and sensing experiments.', kind: 'landscape' },
      { src: 'assets/images/xarm-teleop-poster.jpg', alt: 'Real xArm teleoperation with a laptop and robot arm visible', caption: 'Real-hardware teleoperation: the operator view and robot are visible together.', kind: 'portrait' },
      { src: 'assets/images/xarm-isaac-poster.jpg', alt: 'VR controller operating an xArm digital twin in Isaac Sim', caption: 'Isaac Sim mirrors the control path for replay and policy evaluation.', kind: 'landscape' },
      { src: 'assets/images/xarm-rgbd-poster.jpg', alt: 'RGB depth segmentation and robot control dashboard', caption: 'RGB, depth, segmentation, IMU, and joint controls in one diagnostic view.', kind: 'landscape' },
      { src: 'assets/images/xarm-vr-poster.jpg', alt: 'Six-view RGB depth and segmentation camera dashboard', caption: 'Multiview perception exposes raw and processed observations together.', kind: 'landscape' }
    ],
    videos: [
      { src: 'assets/media/xarm-real-teleop-highlight.mp4', poster: 'assets/images/xarm-teleop-poster.jpg', label: 'Real xArm teleoperation', duration: '12 sec', caption: 'Two reviewed hardware moments: motion without gripping followed by an active gripper sequence.' },
      { src: 'assets/media/xarm-isaac-teleop-highlight.mp4', poster: 'assets/images/xarm-isaac-poster.jpg', label: 'Isaac Sim teleoperation', duration: '10 sec', caption: 'VR input and the simulated xArm response shown without cropping the original portrait recording.' },
      { src: 'assets/media/xarm-rgbd-highlight.mp4', poster: 'assets/images/xarm-rgbd-poster.jpg', label: 'RGB-D, segmentation & robot state', duration: '15 sec', caption: 'A curated window from the D435/WebRTC dashboard used to inspect perception and control together.' },
      { src: 'assets/media/xarm-vr-multiview-highlight.mp4', poster: 'assets/images/xarm-vr-poster.jpg', label: 'VR multiview perception', duration: '16 sec', caption: 'Synchronized RGB, depth, and segmentation views during manipulation.' }
    ]
  },

  world3d: {
    title: 'Sparse 3D Memory & Digital-Twin Reconstruction',
    short: 'A research exploration of point-cloud reconstruction, sparse spatial representations, and Gaussian scene models for robot-readable environments.',
    image: 'assets/images/pointcloud-poster.jpg',
    category: '3D Perception · Digital Twins',
    year: '2026',
    role: 'Research assistant · 3D perception',
    readingTime: '8 min read',
    github: null,
    stack: ['Point Clouds', 'COLMAP', 'FVDB', 'Gaussian Splatting', 'Open3D', 'PyTorch', 'CUDA', 'Isaac Sim'],
    facts: [
      { label: 'Evidence', value: 'Point-cloud reconstruction + scene inspection' },
      { label: 'Research question', value: 'Appearance vs. operational geometry' },
      { label: 'Target use', value: 'Persistent robot memory' }
    ],
    lead: 'A digital twin is useful to robotics only when it can support localization, semantic updates, planning, or repeatable evaluation. This work explores how photorealistic scene representations and sparse geometric memory can coexist without pretending that a beautiful render is automatically a navigation map.',
    problem: 'Dense scene representations are expensive to update and query, while point clouds and occupancy maps often discard the visual detail needed for inspection and human-facing demonstrations. The engineering challenge is to preserve multiple representations of the same place and keep their identities, coordinate frames, and intended uses explicit.',
    chapters: [
      {
        title: 'Start with inspectable geometry',
        paragraphs: [
          'The uploaded screen recordings show point-cloud reconstruction and scene inspection inside a 3D editor. I selected the segment where the reconstructed geometry becomes clearly visible and the viewpoint moves through the interior structure.',
          'This footage is mapped only to the 3D perception project. It is not presented as Go2 navigation or xArm teleoperation, and the copy distinguishes observed reconstruction work from planned semantic-memory integration.'
        ]
      },
      {
        title: 'Separate appearance from robot queries',
        paragraphs: [
          'Gaussian scene models are effective for novel-view rendering and visual replay. Sparse voxel or point-based structures are better suited to collision, occupancy, locality, and incremental semantic updates. The project treats them as complementary products of one scene pipeline.',
          'The shared requirement is stable scene identity: the visual reconstruction, geometric representation, semantic annotations, and robot map must refer to the same physical environment and known transforms.'
        ]
      },
      {
        title: 'Why sparse memory matters',
        paragraphs: [
          'Indoor environments contain large empty regions. Sparse representations spend memory and compute where surfaces and observations exist instead of allocating a dense volume everywhere.',
          'That property is relevant to long-lived robots because the scene must be revisited and updated. A persistent memory layer should support localized writes—new object observations, changed geometry, or confidence updates—without rebuilding the entire world model.'
        ]
      },
      {
        title: 'Digital twins as an evaluation surface',
        paragraphs: [
          'The most useful near-term role of the reconstruction is reproducibility. A captured environment can support camera-placement checks, viewpoint comparison, semantic annotation review, and simulation alignment before another hardware session.',
          'The longer-term research direction is to connect the visual twin to the semantic navigation memory so a named place, a map coordinate, and a visual region can be inspected as one object.'
        ]
      }
    ],
    system: [
      'Image or video frames are organized into a scene with camera poses and reconstruction inputs.',
      'Point-cloud geometry is generated and inspected for coverage, scale, holes, and alignment.',
      'Sparse structures retain queryable geometry for robot-facing operations.',
      'Gaussian scene representations preserve high-fidelity appearance for replay and novel views.',
      'Scene identity and transforms connect reconstruction outputs to future semantic and navigation experiments.'
    ],
    unique: 'The work is presented as a careful bridge between visual reconstruction and operational robot memory. It avoids claiming that one representation solves rendering, localization, semantics, and planning equally well.',
    impact: [
      'Produced real reconstruction evidence and a reviewed 18-second scene-inspection clip.',
      'Created reusable visual assets for digital-twin and perception experiments.',
      'Defined a representation boundary that keeps photorealistic rendering separate from collision and navigation geometry.',
      'Established a path for linking semantic observations to persistent 3D scene state.'
    ],
    gallery: [
      { src: 'assets/images/fvdb-regeneration-poster.jpg', alt: 'Sparse FVDB scene regeneration visible in a 3D editor', caption: 'Reviewed frame from the FVDB regeneration recording.', kind: 'landscape' },
      { src: 'assets/images/colmap-pointcloud.png', alt: 'COLMAP point-cloud reconstruction of an indoor laboratory scene', caption: 'COLMAP reconstruction used to inspect scene coverage and geometry.', kind: 'landscape' },
      { src: 'assets/images/colmap-pointcloud-alt.png', alt: 'Alternate COLMAP point-cloud reconstruction view', caption: 'A second reconstruction view highlighting coverage and alignment.', kind: 'landscape' },
      { src: 'assets/images/world3d-lab.webp', alt: 'Monitor showing a reconstructed point cloud and camera view', caption: 'Point-cloud reconstruction being inspected in the laboratory.', kind: 'landscape' },
      { src: 'assets/images/lab/20260526_203020.webp', alt: 'Second laboratory view of a point cloud reconstruction on screen', caption: 'A second reconstruction view used to inspect scene coverage and alignment.', kind: 'landscape' },
      { src: 'assets/images/pointcloud-poster.jpg', alt: 'Orange point cloud visible in a 3D scene editor', caption: 'Selected frame from the reviewed reconstruction recording.', kind: 'landscape' }
    ],
    videos: [
      { src: 'assets/media/fvdb-regeneration-highlight.mp4', poster: 'assets/images/fvdb-regeneration-poster.jpg', label: 'FVDB scene regeneration', duration: '18 sec', caption: 'Reviewed segment showing a reconstructed sparse scene being inspected from multiple viewpoints.' },
      { src: 'assets/media/pointcloud-reconstruction-highlight.mp4', poster: 'assets/images/pointcloud-poster.jpg', label: 'Point-cloud reconstruction inspection', duration: '18 sec', caption: 'The clearest segment from the uploaded reconstruction recording, showing geometry and viewpoint inspection.' }
    ]
  },

  eval: {
    title: 'Mini Eval for Real-Data Data-Science Agents',
    short: 'Ten Harbor-format tasks that test whether an agent can produce reproducible, production-consumable data-science artifacts—not merely plausible prose.',
    image: 'assets/images/data-eval.svg',
    category: 'Agent Evaluation · Applied AI',
    year: '2026',
    role: 'Evaluation designer & engineer',
    readingTime: '9 min read',
    github: 'https://github.com/pateldhruv1672/data_sci_eval_dhruv',
    stack: ['Harbor', 'Gemini 3.5 Flash', 'Docker', 'Python', 'Pytest', 'Kaggle datasets', 'Trajectory analysis'],
    facts: [
      { label: 'Task suite', value: '10 real-data tasks' },
      { label: 'Evaluation', value: 'Oracle · NOP · 3 model trials' },
      { label: 'Difficulty result', value: '20% deterministic pass@3' }
    ],
    lead: 'The benchmark targets a common failure mode in agent demos: the model writes a convincing analysis but fails to preserve business definitions, reconcile files and modalities, or produce the exact CSV and JSON artifacts a downstream system requires.',
    problem: 'A useful data-science agent must operate on messy real files, maintain definitions across follow-up questions, create verifiable artifacts, and behave consistently across repeated attempts. Free-form judging alone cannot tell whether the agent actually completed that work.',
    chapters: [
      {
        title: 'Tasks come from real data work, not synthetic puzzles',
        paragraphs: [
          'The suite contains ten tasks built from three real Kaggle datasets: hotel booking demand, women’s e-commerce clothing reviews, and Pokémon images. Together they cover tabular analysis, text-plus-tabular reasoning, image and file-system work, and multi-query workflows.',
          'No synthetic rows, labels, images, or charts were introduced. The task distributions preserve the kinds of ambiguity and file handling that make applied data science difficult.'
        ]
      },
      {
        title: 'Every task is an environment and a verifier',
        paragraphs: [
          'Each Harbor task includes instructions, a containerized environment, tests, and a reference solution. The verifier inspects the post-execution state rather than trusting the agent’s final message.',
          'Deterministic checks validate required files, schemas, values, and invariants. Semantic scoring is reserved for qualities that cannot be reduced to an exact match.'
        ]
      },
      {
        title: 'Trajectories turn failures into training signal',
        paragraphs: [
          'The submission captures messages, tool calls, observations, actions, and final outputs for every trial. Oracle and no-op runs validate that the environment and verifier behave as intended; three Gemini trials per task expose reliability rather than a single lucky outcome.',
          'The final deterministic pass@3 was 2 of 10, or 20%, intentionally below the 30% difficulty bar. That headroom makes the suite useful for post-training, prompt iteration, or reinforcement-learning experiments.'
        ]
      },
      {
        title: 'Why this is more useful than a leaderboard number',
        paragraphs: [
          'The output is a reproducible failure-analysis package: task definitions, logs, trajectories, deterministic scores, semantic scores, and reports. An engineer can see where the agent drifted from a definition, failed to create an artifact, or mishandled a modality.',
          'That turns evaluation into an engineering loop instead of a one-time score.'
        ]
      }
    ],
    system: [
      'Harbor defines each task instruction, sandbox, agent, trajectory, and verifier contract.',
      'Real datasets and dependencies are mounted into isolated task environments.',
      'Oracle and no-op runs validate the task and establish upper/lower behavior bounds.',
      'Three Gemini trials per task are executed and captured with full trajectories.',
      'Deterministic tests emit the official pass/fail reward; semantic scoring adds diagnostic resolution.',
      'Aggregation scripts produce pass@k summaries and a reviewable report.'
    ],
    unique: 'The suite evaluates data-science work products and execution traces, not the tone of the final answer. It is deliberately hard enough to preserve meaningful headroom.',
    impact: [
      'Delivered ten complete, reproducible Harbor tasks across multiple data modalities.',
      'Validated task difficulty with oracle, no-op, and repeated model trials.',
      'Produced concrete trajectories that can support post-training or targeted agent improvements.',
      'Demonstrated evaluation design that connects model behavior to production artifact requirements.'
    ],
    gallery: [
      { src: 'assets/images/data-eval.svg', alt: 'Diagram of parallel agent trajectories and verifier checkpoints', caption: 'The benchmark separates the agent trajectory from deterministic artifact verification.', kind: 'illustration' }
    ],
    videos: []
  },

  photos: {
    title: 'Big Photos — Distributed Photo Intelligence',
    short: 'An 11-service visual-intelligence platform spanning HDFS, Spark, Kafka, Ray Serve, deep-learning inference, vector search, APIs, and a React product surface.',
    image: 'assets/images/big-photos.svg',
    category: 'Distributed ML · Computer Vision',
    year: '2026',
    role: 'ML platform engineer',
    readingTime: '10 min read',
    github: 'https://github.com/pateldhruv1672/Big-photos',
    stack: ['React', 'FastAPI', 'Kafka KRaft', 'HDFS', 'Spark', 'Ray Serve', 'MobileNetV3', 'Ollama/LLaVA', 'HNSW', 'Parquet', 'Docker'],
    facts: [
      { label: 'Runtime', value: '11 Docker services' },
      { label: 'Dataset', value: 'MIRFLICKR-25K' },
      { label: 'Vision task', value: '24-class multilabel classification' }
    ],
    lead: 'Big Photos asks what happens after a computer-vision model works in a notebook. The answer is a complete product path: distributed storage, event-driven ingestion, enrichment, embeddings, scalable inference, search, analytics, APIs, and an interface that exposes those capabilities to a user.',
    problem: 'Photo intelligence is a systems problem. Images are large, enrichment is expensive, training and inference have different workloads, uploads arrive asynchronously, and search must combine visual labels, captions, metadata, and embeddings. A single Python process cannot represent the operational boundaries clearly.',
    chapters: [
      {
        title: 'Eleven services, one coherent user flow',
        paragraphs: [
          'The React/Vite frontend exposes gallery, semantic search, stories, and uploads. FastAPI provides the product API. Kafka carries upload and processing events. HDFS stores raw images and derived artifacts. Spark produces analytics and aggregates. Ray Serve hosts model inference. HNSW serves vector similarity.',
          'The architecture is decomposed by operational responsibility, but every component still participates in a traceable path from uploaded pixels to searchable, enriched output.'
        ]
      },
      {
        title: 'A batch foundation with a real-time upload path',
        paragraphs: [
          'The MIRFLICKR-25K ingestion path loads images and annotations into HDFS and uses Spark to build metadata and exploratory outputs. Enrichment adds captions, categories, and embeddings, with a fallback to dataset tags when the local vision-language model is unavailable.',
          'The upload consumer handles the real-time path: persist the image, run classification, generate an embedding, update the HNSW index, write metadata, and publish the resulting event.'
        ]
      },
      {
        title: 'Model serving is separated from product APIs',
        paragraphs: [
          'A MobileNetV3 Small model is fine-tuned for 24-class multilabel classification and served through Ray Serve. FastAPI calls the serving layer rather than embedding model lifecycle inside the web API.',
          'That separation allows training, inference scaling, and web traffic to evolve independently while preserving a clear contract.'
        ]
      },
      {
        title: 'Search joins multiple representations',
        paragraphs: [
          'Metadata and captions support filtered and lexical experiences; sentence-transformer embeddings feed an HNSW index for semantic similarity. The UI can therefore expose gallery browsing, search, and generated “stories” without pretending one model output is sufficient for every interaction.'
        ]
      }
    ],
    system: [
      'HDFS stores raw images, basic metadata, enriched metadata, uploads, model artifacts, and aggregate outputs.',
      'Spark runs distributed EDA, metadata generation, and story/aggregate jobs.',
      'Ollama/LLaVA enriches images when available; annotation-based fallback keeps the pipeline operable.',
      'MobileNetV3 Small is trained for multilabel classification and served through Ray Serve.',
      'Sentence-transformer embeddings are indexed in HNSW for semantic retrieval.',
      'Kafka decouples upload, labeling, failure, and downstream processing events.',
      'FastAPI and React expose the system as a usable product rather than a collection of jobs.'
    ],
    unique: 'The project demonstrates end-to-end ML platform thinking: model training is one component inside a storage, eventing, serving, retrieval, and product architecture.',
    impact: [
      'Integrated eleven containerized services into a single photo-intelligence workflow.',
      'Connected a real dataset, distributed analytics, model serving, vector retrieval, and a product UI.',
      'Designed both batch ingestion and event-driven user upload paths.',
      'Made model and infrastructure boundaries explicit enough to test and replace independently.'
    ],
    gallery: [
      { src: 'assets/images/big-photos.svg', alt: 'Distributed photo intelligence architecture illustration', caption: 'The platform connects storage, streaming, batch analytics, model serving, retrieval, and product APIs.', kind: 'illustration' }
    ],
    videos: []
  },

  degree: {
    title: 'The Last Degree — Labor-Market ETL',
    short: 'A daily Airflow-to-Snowflake pipeline for transforming live US job listings into skill-demand and salary analytics for education ROI research.',
    image: 'assets/images/last-degree-overview.png',
    coverFit: 'contain',
    category: 'Data Engineering · Analytics',
    year: '2025',
    role: 'Data platform engineer',
    readingTime: '7 min read',
    github: 'https://github.com/pateldhruv1672/THE-LAST-DEGREE',
    stack: ['Apache Airflow', 'Snowflake', 'dbt', 'Adzuna API', 'Python', 'SQL', 'Docker'],
    facts: [
      { label: 'Source', value: 'Adzuna job listings API' },
      { label: 'Target scale', value: '~1M active US listings' },
      { label: 'Schedule', value: 'Daily · 2 AM UTC' }
    ],
    lead: 'Education ROI is usually discussed with static rankings and anecdotes. This project starts from a more defensible substrate: a refreshable warehouse of job titles, employers, salaries, locations, descriptions, categories, and posting dates.',
    problem: 'Live labor-market data is paginated, rate-limited, duplicated, partially missing, and full of HTML and inconsistent salary formats. Before any ROI or forecasting model can be credible, the ingestion and transformation path must make those inconsistencies visible and repeatable.',
    chapters: [
      {
        title: 'Extraction is designed for a changing external API',
        paragraphs: [
          'An Airflow task fetches Adzuna pages, handles credentials and configurable page limits, and records the fields required for downstream analysis. Pagination and rate limits are treated as expected operational conditions, not exceptions to ignore.'
        ]
      },
      {
        title: 'Transformation preserves analytical meaning',
        paragraphs: [
          'The transformation stage strips HTML, normalizes salary fields, parses and validates posting dates, extracts location structure, and removes duplicates. These steps are versioned separately from extraction so source changes do not silently alter business definitions.'
        ]
      },
      {
        title: 'Snowflake loading is restartable and auditable',
        paragraphs: [
          'Records land through staging tables and merge-based upserts. Load statistics make each run inspectable, while the job_id and load_date keys preserve both identity and ingestion context.',
          'Analytics views support skill demand, salary trends, company hiring, category distribution, and geography. dbt provides the path from raw warehouse tables to tested analytical models.'
        ]
      }
    ],
    system: [
      'Airflow schedules the pipeline daily and makes extraction, transformation, and loading independently retryable.',
      'The extractor handles Adzuna pagination, credentials, rate limits, and job-field selection.',
      'The transformer cleans HTML, normalizes salary, validates dates, parses location, and deduplicates records.',
      'Snowflake staging tables isolate incoming data before merge/upsert into analytics tables.',
      'SQL and dbt models expose skill, salary, company, location, and category views for later ROI analysis.'
    ],
    unique: 'The project treats education ROI as a continuously refreshed data product. It invests in lineage, scheduling, warehouse semantics, and restartability before adding predictive claims.',
    impact: [
      'Designed a pipeline for approximately one million active US listings and configurable daily ingestion.',
      'Made labor-market signals queryable by skill, company, category, geography, salary, and time.',
      'Created a warehouse foundation for future degree-ROI and forecasting models.',
      'Documented architecture, quick-start, SQL schema, and operational setup for reproducibility.'
    ],
    gallery: [
      { src: 'assets/images/last-degree-overview.png', alt: 'The Last Degree graduate ROI intelligence dashboard', caption: 'Graduate ROI overview combining earnings, job volume, layoff risk, and university comparisons.', kind: 'landscape' },
      { src: 'assets/images/last-degree-layoff.png', alt: 'The Last Degree layoff risk monitor dashboard', caption: 'WARN Act monitoring, industry stability scores, company layoff counts, and monthly trends.', kind: 'landscape' },
      { src: 'assets/images/last-degree.svg', alt: 'Airflow to Snowflake labor market pipeline diagram', caption: 'Adzuna extraction, transformation, Snowflake loading, and analytical models.', kind: 'illustration' }
    ],
    videos: []
  },

  pinecone: {
    title: 'Pinecone Semantic Search Pipeline',
    short: 'A Dockerized Airflow DAG that downloads Medium articles, cleans text, builds sentence embeddings, creates a Pinecone index, upserts metadata, and verifies retrieval.',
    image: 'assets/images/pinecone-search.svg',
    category: 'Retrieval · Data Platforms',
    year: '2025',
    role: 'ML & data engineer',
    readingTime: '6 min read',
    github: 'https://github.com/pateldhruv1672/Pinecone-Search-Engine',
    stack: ['Apache Airflow', 'Pinecone', 'all-MiniLM-L6-v2', 'Sentence Transformers', 'Docker Compose', 'Python', 'Pandas'],
    facts: [
      { label: 'Embedding', value: 'all-MiniLM-L6-v2' },
      { label: 'Index', value: '384 dimensions · dot product' },
      { label: 'Validation', value: 'Pipeline-level search query' }
    ],
    lead: 'This project turns semantic search from a notebook sequence into an observable pipeline. Data download, cleaning, index creation, embedding, upsert, and validation are represented as explicit tasks with logs and failure boundaries.',
    problem: 'Retrieval demos often hide the operational work: the dataset changes, an index has the wrong dimension, the model and metric disagree, or the pipeline finishes without proving that a query returns meaningful metadata. The DAG makes those assumptions executable.',
    chapters: [
      {
        title: 'The DAG is the system specification',
        paragraphs: [
          'The workflow downloads a Medium-article dataset, preprocesses text, creates or resets the Pinecone index, generates embeddings, upserts vectors with metadata, and runs a test query. Each stage can be retried and inspected independently.'
        ]
      },
      {
        title: 'The representation contract is explicit',
        paragraphs: [
          'The all-MiniLM-L6-v2 model produces 384-dimensional sentence embeddings. The Pinecone index uses the same dimensionality with dot-product similarity. Keeping that contract visible prevents the common dimension and metric mismatch failures.'
        ]
      },
      {
        title: 'Verification is part of the pipeline',
        paragraphs: [
          'The final task runs a semantic query such as “What is ethics in AI?” and inspects returned IDs, scores, and titles. The system does not treat a successful upsert as proof that search works.'
        ]
      }
    ],
    system: [
      'Docker Compose creates a reproducible Airflow environment with retrieval dependencies.',
      'Airflow downloads and preprocesses the source article data.',
      'The DAG initializes a 384-dimensional dot-product Pinecone index.',
      'Sentence Transformers generates dense embeddings and preserves result metadata.',
      'Vectors are upserted, then a dedicated verification task executes a semantic query and logs results.'
    ],
    unique: 'The project makes retrieval correctness observable at pipeline level. Index construction and a real query are part of one reproducible workflow.',
    impact: [
      'Converted an end-to-end semantic-search workflow into restartable Airflow tasks.',
      'Exposed data, embedding, index, and query failures at clear boundaries.',
      'Created a practical foundation for later hybrid retrieval and semantic-caching systems.',
      'Documented deployment and troubleshooting for index readiness, API configuration, and dimension mismatches.'
    ],
    gallery: [
      { src: 'assets/images/pinecone-search.svg', alt: 'Semantic search pipeline diagram', caption: 'Medium articles flow through preprocessing, embeddings, Pinecone indexing, and a verification query.', kind: 'illustration' }
    ],
    videos: []
  },

  avian: {
    title: 'Avian Journeys — Global Migration Analytics',
    short: 'A Python and Power BI analysis of 10,000 migratory journeys across 42 variables, with geospatial, environmental, seasonal, and species-level storytelling.',
    image: 'assets/images/avian-cover.webp',
    category: 'Data Visualization · BI',
    year: '2025',
    role: 'Data analyst & visualization designer',
    readingTime: '7 min read',
    github: 'https://github.com/pateldhruv1672/Data-Visualization',
    stack: ['Python', 'Pandas', 'Seaborn', 'Matplotlib', 'Power BI', 'Geospatial analysis'],
    facts: [
      { label: 'Dataset', value: '10,000 journeys' },
      { label: 'Feature space', value: '42 variables' },
      { label: 'Delivery', value: 'EDA notebook + 5-page Power BI report' }
    ],
    lead: 'Avian Journeys begins with statistical exploration and ends with an interactive report designed for questions: where species travel, which habitats dominate, how weather relates to interruption and success, and how migration changes across seasons.',
    problem: 'Migration outcomes depend on species, geography, habitat, weather, distance, speed, altitude, duration, and tracking practices. A flat table or a gallery of unrelated charts makes it difficult to see how those dimensions interact.',
    chapters: [
      {
        title: 'Exploration establishes what can be trusted',
        paragraphs: [
          'The Python notebook inspects missing values, outliers, distributions, migration success, habitat, weather, speed, altitude, and distance before the dashboard narrative is designed. The “Interrupted” field receives explicit data-quality treatment rather than being silently dropped.',
          'This keeps the Power BI report anchored in relationships that were already checked in code.'
        ]
      },
      {
        title: 'Page one creates an analytical entry point',
        paragraphs: [
          'The opening page frames migration as a journey and summarizes the dataset with total observations, success rate, average flight distance, speed, duration, and maximum altitude. It gives a viewer enough context to interpret the later pages without turning the introduction into a wall of charts.'
        ]
      },
      {
        title: 'Geography and habitat are viewed together',
        paragraphs: [
          'The second page combines a global distribution map with habitat totals and a species ranking. This makes it possible to move from “where are the birds?” to “which species and habitat categories contribute to those locations?” in one view.'
        ]
      },
      {
        title: 'Environmental and seasonal stories answer different questions',
        paragraphs: [
          'The environmental page separates average conditions from migration drivers and interruption categories. The seasonal page compares monthly departures, seasonal shares, distance, and success across species.',
          'The dashboard is therefore organized around stakeholder questions rather than chart types.'
        ]
      }
    ],
    system: [
      'Pandas-based cleaning and EDA validate distributions, missingness, outliers, and relationships.',
      'Matplotlib and Seaborn support exploratory statistical views before dashboard selection.',
      'Power BI models the cleaned data for five interactive report pages.',
      'Geospatial views use start/end coordinates to compare migration regions.',
      'Species, habitat, weather, and season filters support drill-down without duplicating static reports.'
    ],
    unique: 'The strongest part is the handoff from reproducible Python exploration to a question-oriented BI narrative. The four supplied screenshots in this portfolio are the actual report pages, not generic bird imagery.',
    impact: [
      'Analyzed 10,000 records and 42 variables across ecological and operational dimensions.',
      'Built a five-page Power BI story spanning overview, geography, environment, seasonality, and species outcomes.',
      'Made complex migration patterns approachable to non-technical viewers through consistent visual hierarchy and filters.',
      'Delivered the work as a DATA 230 team project with the notebook, PBIX report, presentation, and repository documentation.'
    ],
    gallery: [
      { src: 'assets/images/avian/dashboard-118.webp', alt: 'Avian Journeys report overview and key statistics', caption: 'Report overview: narrative context and high-level migration statistics.', kind: 'landscape' },
      { src: 'assets/images/avian/dashboard-119.webp', alt: 'Avian Journeys map species and habitat dashboard page', caption: 'Geographic distribution, habitat counts, and species comparison.', kind: 'landscape' },
      { src: 'assets/images/avian/dashboard-120.webp', alt: 'Avian Journeys environmental factors dashboard page', caption: 'Environmental conditions, migration drivers, and interruption categories.', kind: 'landscape' },
      { src: 'assets/images/avian/dashboard-121.webp', alt: 'Avian Journeys seasonal migration and success dashboard page', caption: 'Seasonal dynamics, flight distance, and migration success by species.', kind: 'landscape' }
    ],
    videos: []
  }
};

window.PROJECT_ARCHIVE = [
  {
    title: 'AutoQuote',
    note: 'A multimodal quoting workflow combining a React/TypeScript map experience, image-to-prompt analysis, automated research, geocoding, and voice-based follow-up.',
    stack: 'React · TypeScript · Express · VAPI · DynamoDB',
    image: 'assets/images/autoquote-app.png',
    url: 'https://github.com/pateldhruv1672/auto-quote'
  },
  {
    title: 'Stock Forecasting Pipeline',
    note: 'A two-DAG Airflow and Snowflake ML pipeline for daily OHLCV ingestion, per-symbol model training, parallel forecasting, and analytics-ready history-plus-forecast tables.',
    stack: 'Airflow · Snowflake ML · yfinance · Python',
    image: 'assets/images/stock-forecasting.png',
    url: 'https://github.com/pateldhruv1672/Stock-Price-Forecasting-using-Snowflake-and-Airflow'
  },
  {
    title: 'AI Data Insights',
    note: 'A frontend analytics prototype built on React, TypeScript, Supabase, TanStack Query, Recharts, Tailwind, and a reusable component system.',
    stack: 'React · TypeScript · Supabase · Recharts',
    url: 'https://github.com/pateldhruv1672/ai-data-insights'
  },
  {
    title: 'LinkedIn AI Experiments',
    note: 'Explorations in agent-oriented workflow design and service composition. Presented as an experimental repository rather than a production deployment.',
    stack: 'Agents · APIs · Workflow orchestration',
    url: 'https://github.com/pateldhruv1672/Linkedin_AI'
  }
];
