window.PROJECT_ORDER = [
  "go2",
  "xarm",
  "world3d",
  "eval",
  "photos",
  "degree",
  "pinecone",
  "avian"
];

window.PROJECTS = {
  "go2": {
    "title": "Persistent Semantic Navigation for Unitree Go2",
    "short": "A ROS 2 workspace for mapping a building, saving named places with the map, and bringing a Unitree Go2 back into the same session for later Nav2 runs.",
    "image": "assets/images/go2-navigation-poster.jpg",
    "category": "Embodied AI · Autonomous Robotics",
    "year": "2025–Present",
    "role": "Research assistant · System architect",
    "readingTime": "11 min read",
    "github": "https://github.com/pateldhruv1672/go2_ros",
    "stack": [
      "ROS 2 Jazzy",
      "Nav2",
      "SLAM Toolbox",
      "Cartographer",
      "AMCL",
      "LangGraph",
      "OpenRouter VLM",
      "Python",
      "C++",
      "Unitree SDK"
    ],
    "facts": [
      {
        "label": "Operating modes",
        "value": "Base · Teach · Resume"
      },
      {
        "label": "Persistent artifacts",
        "value": "Map · Places · Session metadata"
      },
      {
        "label": "Primary interface",
        "value": "Nav2 actions + ROS 2 topics"
      }
    ],
    "lead": "I built this because a navigation demo is not very useful if the robot has to remap the space after every restart. The workspace separates robot bring-up, mapping, localization, semantic memory, and agent tools so I can test and debug each layer on its own.",
    "problem": "The first issue was not language understanding; it was keeping the ROS graph stable. Stale processes, duplicate SLAM or Nav2 launches, and competing map-to-odom publishers could make a run look healthy while localization was already invalid. I needed a teach/resume workflow that saves one complete session and enables motion only after TF, localization, lifecycle nodes, and Nav2 actions are ready.",
    "chapters": [
      {
        "title": "Stabilizing the ROS graph",
        "paragraphs": [
          "The repository keeps base bring-up separate from the experimental overlays. Base mode starts the driver and sensors. Teach mode adds one SLAM owner. Resume mode adds one localization and Nav2 owner. The semantic and voice packages are launched only after the underlying graph is healthy.",
          "This separation makes failures easier to localize. A TF problem stays a TF problem instead of appearing later as a failed semantic command or an unexplained Nav2 timeout."
        ],
        "bullets": [
          "The workspace uses ROS 2 Jazzy, CycloneDDS, a fixed ROS domain, and the project virtual environment.",
          "Every navigation goal is submitted in the map frame.",
          "Lifecycle state, action availability, sensor freshness, and TF ownership are checked before semantic commands run."
        ]
      },
      {
        "title": "Saving one complete map session",
        "paragraphs": [
          "Teach mode builds the occupancy map and records named places against that map. Labels can be entered manually or proposed from camera observations, but the saved place always resolves to metric coordinates.",
          "A session is complete only when the map image, map metadata, place labels, and session metadata have been written together. That gives resume mode one explicit unit of state instead of a loose set of files."
        ],
        "bullets": [
          "map.yaml and map.pgm store the occupancy map.",
          "places.yaml stores named locations and map coordinates.",
          "session.yaml identifies the selected session and supporting metadata.",
          "A saved spawn reference provides a known starting landmark for recovery."
        ]
      },
      {
        "title": "Resuming with one localization owner",
        "paragraphs": [
          "Resume mode selects a saved session, starts localization against that map, and waits for a valid map-to-odom-to-base transform chain. Nav2 is not treated as ready until the relevant lifecycle nodes and actions are available.",
          "The launch flow also avoids running SLAM and AMCL as competing map-to-odom publishers. If a session is incomplete, the failure is reported explicitly instead of silently mixing live and saved state."
        ]
      },
      {
        "title": "Keeping language above the control layer",
        "paragraphs": [
          "A natural-language request is resolved to a saved place, converted into a geometric goal, and submitted through typed tools. The planner and executor can inspect preconditions, action feedback, and failure state.",
          "The language model never publishes cmd_vel. Nav2 remains responsible for path planning and execution, while the agent layer selects goals and bounded recovery actions."
        ]
      },
      {
        "title": "What I inspect during a run",
        "paragraphs": [
          "RViz, topic inspection, lifecycle queries, action feedback, and logs are part of the experiment. I use them to verify map ownership, localization, path generation, controller behavior, and whether the selected semantic session matches the loaded map.",
          "The same topic contract is being mirrored in simulation so the semantic and agent layers can be tested without maintaining a second set of interfaces."
        ]
      }
    ],
    "system": [
      "The Unitree driver publishes LiDAR, camera, IMU, odometry, joint state, TF, and the velocity-command interface.",
      "Teach mode runs a single SLAM instance and writes the map and named places into a session directory.",
      "Resume mode starts localization against the selected map and activates Nav2 only after the transform chain is valid.",
      "The memory layer resolves a place name to coordinates from the active session.",
      "Planner and executor nodes call typed Nav2 tools and handle feedback, timeout, and bounded recovery.",
      "RViz and logs expose maps, paths, markers, lifecycle state, and the evidence needed to reproduce a failure."
    ],
    "unique": "The key design choice is simple: language can choose a saved goal, but it does not own low-level robot control. TF ownership, session integrity, and Nav2 readiness are checked before the agent layer is allowed to act.",
    "impact": [
      "Split the workspace into base, teach, and resume modes so SLAM and localization do not compete for map-to-odom.",
      "Saved map.yaml, map.pgm, places.yaml, and session.yaml as one reusable navigation session.",
      "Reloaded semantic places with the selected map instead of storing labels separately from metric state.",
      "Defined a shared real/simulation topic contract for later navigation and recovery experiments."
    ],
    "gallery": [
      {
        "src": "assets/images/go2-navigation-poster.jpg",
        "alt": "Unitree Go2 traversing the SJSU Robotics and Digital Twin Lab during a navigation run",
        "caption": "Frame from the autonomous navigation recording.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/go2-motion-poster.jpg",
        "alt": "Unitree Go2 executing a motion skill in the laboratory",
        "caption": "Frame from the Go2 motion-skills recording.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/go2-lab.webp",
        "alt": "Unitree G1 and Go2 robots inside the SJSU Robotics and Digital Twin Lab",
        "caption": "The real hardware environment used for autonomy experiments.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/lab/20260526_203953.webp",
        "alt": "Unitree robots and workstations in the SJSU robotics laboratory",
        "caption": "Go2, G1, and manipulation platforms share the same research space.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/lab/20260526_203526.webp",
        "alt": "Unitree Go2 quadruped in front of laboratory workstations",
        "caption": "Go2 during lab bring-up and sensor validation.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/lab/20260526_204036.webp",
        "alt": "Unitree Go2 and G1 robots in the robotics laboratory",
        "caption": "Physical AI experiments are validated on real platforms, not only in simulation.",
        "kind": "portrait"
      }
    ],
    "videos": [
      {
        "src": "assets/media/go2-navigation-highlight.mp4",
        "poster": "assets/images/go2-navigation-poster.jpg",
        "label": "Go2 autonomous navigation",
        "duration": "18 sec",
        "caption": "18-second excerpt from a Go2 navigation run in the lab. The clip includes the original audio.",
        "hasAudio": true
      },
      {
        "src": "assets/media/go2-motion-skills-highlight.mp4",
        "poster": "assets/images/go2-motion-poster.jpg",
        "label": "Go2 motion skills",
        "duration": "20 sec",
        "caption": "20-second hardware excerpt showing Go2 motion behaviors. The clip includes the original audio.",
        "hasAudio": true
      }
    ]
  },
  "xarm": {
    "title": "xArm Teleoperation, Perception & Demonstration Learning",
    "short": "Teleoperation for a real xArm and its Isaac Sim counterpart, with RGB-D observations, robot state, gripper events, and structured episodes for behavior-cloning experiments.",
    "image": "assets/images/xarm-teleop-poster.jpg",
    "category": "Robot Learning · Manipulation",
    "year": "2026–Present",
    "role": "Research assistant · Robotics engineer",
    "readingTime": "12 min read",
    "github": null,
    "stack": [
      "ROS 2",
      "xArm SDK",
      "Isaac Sim",
      "PyTorch",
      "Behavior Cloning",
      "RGB-D",
      "WebRTC",
      "OpenCV",
      "Python",
      "C++"
    ],
    "facts": [
      {
        "label": "Backends",
        "value": "Real xArm + Isaac Sim"
      },
      {
        "label": "Observations",
        "value": "RGB · Depth · Segmentation · Robot state"
      },
      {
        "label": "Output",
        "value": "Filtered demonstration episodes"
      }
    ],
    "lead": "The arm following a controller is only the first step. I need each demonstration to line up operator commands, joint state, gripper state, and camera observations so the episode can be replayed, filtered, and used for training.",
    "problem": "Early recordings exposed timing mismatches, incomplete gripper events, and failed trials that looked acceptable on video but were unusable as training data. I reorganized the work around a common ROS 2 interface and an explicit episode format for both hardware and simulation.",
    "chapters": [
      {
        "title": "One interface for the real arm and Isaac Sim",
        "paragraphs": [
          "The physical xArm is the reference system. Commands, joint state, end-effector state, gripper state, and camera observations are exposed through ROS 2 interfaces that can be mirrored in Isaac Sim.",
          "Keeping the interface consistent lets the same teleoperation and recording logic work with both backends. The simulator is used for replay, policy training, and failure analysis rather than as a separate demo."
        ]
      },
      {
        "title": "Recording demonstrations as episodes",
        "paragraphs": [
          "A demonstration stores the information required to reconstruct the run: operator input, joint trajectories, gripper transitions, timestamps, and visual observations. Each episode has an explicit start and end and can be accepted, rejected, or annotated before training.",
          "The quality gate matters more than raw volume. A smaller set of aligned, successful episodes is more useful for behavior cloning than a directory of videos with no action-state correspondence."
        ],
        "bullets": [
          "Episode boundaries prevent adjacent trials from being merged.",
          "Robot and camera timestamps are retained for alignment checks.",
          "Gripper actions are stored explicitly rather than inferred from video.",
          "Failed or incomplete runs can be filtered before training."
        ]
      },
      {
        "title": "Making perception failures visible",
        "paragraphs": [
          "The RGB-D dashboard shows color, depth, segmentation, robot controls, and state in the same view. A separate multiview feed shows raw and processed camera streams together.",
          "This helps separate policy errors from calibration, depth, segmentation, or latency problems. I can inspect the observation path before deciding that a model needs to be retrained."
        ]
      },
      {
        "title": "Using simulation to close specific gaps",
        "paragraphs": [
          "Behavior-cloning experiments run in Isaac Sim with variation in object pose, lighting, and contact parameters. The goal is to identify which conditions break the learned behavior before running another hardware session.",
          "Failures are returned to the data loop: collect a missing behavior, reject a bad episode, change a randomization range, or fix an interface. This keeps iteration tied to observed failure modes."
        ]
      }
    ],
    "system": [
      "VR or operator input is converted into bounded end-effector or joint commands.",
      "The xArm driver executes commands and publishes joint, end-effector, and gripper state.",
      "RGB-D and segmentation streams provide the visual observations used for debugging and training.",
      "The recorder writes actions, robot state, images, timestamps, and validation metadata into episodes.",
      "Isaac Sim mirrors the control and observation interfaces for replay and behavior-cloning tests.",
      "Accepted episodes and failure analysis determine the next data-collection run."
    ],
    "unique": "The same control and recording contract is used for hardware and simulation. That keeps teleoperation, dataset generation, and policy evaluation in one workflow instead of three unrelated demos.",
    "impact": [
      "Recorded separate real-arm, gripper, Isaac Sim, RGB-D, and multiview demonstrations.",
      "Created an episode structure that preserves actions, state, observations, and timing for imitation learning.",
      "Made calibration and perception failures visible before they are treated as model failures.",
      "Set up a repeatable path from teleoperation to simulation tests and hardware evaluation."
    ],
    "gallery": [
      {
        "src": "assets/images/xarm-lab.webp",
        "alt": "Two xArm robots and perception equipment on a laboratory workbench",
        "caption": "The dual-arm workbench used for manipulation and sensing experiments.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/xarm-teleop-poster.jpg",
        "alt": "Real xArm teleoperation with a laptop and robot arm visible",
        "caption": "Real-hardware teleoperation: the operator view and robot are visible together.",
        "kind": "portrait"
      },
      {
        "src": "assets/images/xarm-isaac-poster.jpg",
        "alt": "VR controller operating an xArm digital twin in Isaac Sim",
        "caption": "Isaac Sim mirrors the control path for replay and policy evaluation.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/xarm-rgbd-poster.jpg",
        "alt": "RGB depth segmentation and robot control dashboard",
        "caption": "RGB, depth, segmentation, IMU, and joint controls in one diagnostic view.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/xarm-vr-poster.jpg",
        "alt": "Six-view RGB depth and segmentation camera dashboard",
        "caption": "Multiview perception exposes raw and processed observations together.",
        "kind": "landscape"
      }
    ],
    "videos": [
      {
        "src": "assets/media/xarm-real-teleop-highlight.mp4",
        "poster": "assets/images/xarm-teleop-poster.jpg",
        "label": "Real xArm teleoperation",
        "duration": "12 sec",
        "caption": "Two reviewed hardware moments: motion without gripping followed by an active gripper sequence."
      },
      {
        "src": "assets/media/xarm-isaac-teleop-highlight.mp4",
        "poster": "assets/images/xarm-isaac-poster.jpg",
        "label": "Isaac Sim teleoperation",
        "duration": "10 sec",
        "caption": "VR input and the simulated xArm response shown without cropping the original portrait recording."
      },
      {
        "src": "assets/media/xarm-rgbd-highlight.mp4",
        "poster": "assets/images/xarm-rgbd-poster.jpg",
        "label": "RGB-D, segmentation & robot state",
        "duration": "15 sec",
        "caption": "A curated window from the D435/WebRTC dashboard used to inspect perception and control together."
      },
      {
        "src": "assets/media/xarm-vr-multiview-highlight.mp4",
        "poster": "assets/images/xarm-vr-poster.jpg",
        "label": "VR multiview perception",
        "duration": "16 sec",
        "caption": "Synchronized RGB, depth, and segmentation views during manipulation."
      }
    ]
  },
  "world3d": {
    "title": "Sparse 3D Memory & Digital-Twin Reconstruction",
    "short": "COLMAP point clouds, FVDB sparse volumes, and Gaussian Splatting experiments for capturing the lab and connecting visual reconstructions to robot maps.",
    "image": "assets/images/pointcloud-poster.jpg",
    "category": "3D Perception · Digital Twins",
    "year": "2026",
    "role": "Research assistant · 3D perception",
    "readingTime": "8 min read",
    "github": null,
    "stack": [
      "Point Clouds",
      "COLMAP",
      "FVDB",
      "Gaussian Splatting",
      "Open3D",
      "PyTorch",
      "CUDA",
      "Isaac Sim"
    ],
    "facts": [
      {
        "label": "Evidence",
        "value": "Point-cloud reconstruction + scene inspection"
      },
      {
        "label": "Research question",
        "value": "Appearance vs. operational geometry"
      },
      {
        "label": "Target use",
        "value": "Persistent robot memory"
      }
    ],
    "lead": "This is an ongoing research track, not a finished mapping product. I am comparing representations for different jobs: point clouds for geometry inspection, Gaussian Splatting for visual replay, and sparse structures for robot-facing spatial memory.",
    "problem": "A photorealistic reconstruction is not automatically useful for localization or collision checking, while an occupancy map does not preserve enough visual detail for inspection or novel views. The practical problem is keeping multiple representations of the same room aligned and explicit about what each one is used for.",
    "chapters": [
      {
        "title": "Checking geometry before adding semantics",
        "paragraphs": [
          "The reconstruction recordings show the point cloud and sparse scene geometry inside a 3D editor. I use these views to inspect coverage, scale, holes, camera placement, and alignment before attaching semantic labels.",
          "The clips on this page are mapped only to the reconstruction work. They are not presented as robot-navigation footage."
        ]
      },
      {
        "title": "Different representations for different queries",
        "paragraphs": [
          "Gaussian Splatting is useful for visual replay and novel-view rendering. Point clouds and sparse voxel structures are better suited to geometric queries, occupancy, locality, and incremental updates.",
          "I keep these representations separate until their coordinate frames and scene identity are known. A render, a sparse map, and a Nav2 map should not be treated as interchangeable."
        ]
      },
      {
        "title": "Why sparse storage matters",
        "paragraphs": [
          "Indoor scenes contain a large amount of empty space. Sparse structures allocate memory around observed surfaces instead of filling the entire volume.",
          "That is useful for a long-lived robot because updates are local: a new object observation, a changed surface, or a confidence update should not require rebuilding the whole scene."
        ]
      },
      {
        "title": "Using the digital twin for repeatable checks",
        "paragraphs": [
          "The immediate value is reproducibility. A captured scene can support camera-placement checks, viewpoint comparison, annotation review, and simulation alignment before another hardware run.",
          "The next step is to connect visual regions, sparse geometry, semantic observations, and map coordinates through stable transforms."
        ]
      }
    ],
    "system": [
      "Image and video frames are organized with camera-pose and reconstruction inputs.",
      "COLMAP or point-cloud outputs are inspected for coverage, scale, holes, and alignment.",
      "Sparse structures retain geometry for robot-facing spatial queries and local updates.",
      "Gaussian scene models retain appearance for visual replay and novel viewpoints.",
      "Scene identity and transforms connect the reconstruction to later semantic and navigation work."
    ],
    "unique": "I do not use one representation for every task. Appearance, sparse geometry, and navigation state stay separate until there is a reliable transform and a clear query each representation must support.",
    "impact": [
      "Generated point-cloud and sparse-scene reconstructions from the uploaded lab recordings.",
      "Produced short clips and reference images for reconstruction review.",
      "Defined a clean boundary between visual rendering and robot-facing geometry.",
      "Prepared the scene data for later alignment with semantic observations and navigation maps."
    ],
    "gallery": [
      {
        "src": "assets/images/fvdb-regeneration-poster.jpg",
        "alt": "Sparse FVDB scene regeneration visible in a 3D editor",
        "caption": "Frame from the FVDB regeneration recording.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/colmap-pointcloud.png",
        "alt": "COLMAP point-cloud reconstruction of an indoor laboratory scene",
        "caption": "COLMAP reconstruction used to inspect scene coverage and geometry.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/colmap-pointcloud-alt.png",
        "alt": "Alternate COLMAP point-cloud reconstruction view",
        "caption": "A second reconstruction view highlighting coverage and alignment.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/world3d-lab.webp",
        "alt": "Monitor showing a reconstructed point cloud and camera view",
        "caption": "Point-cloud reconstruction being inspected in the laboratory.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/lab/20260526_203020.webp",
        "alt": "Second laboratory view of a point cloud reconstruction on screen",
        "caption": "A second reconstruction view used to inspect scene coverage and alignment.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/pointcloud-poster.jpg",
        "alt": "Orange point cloud visible in a 3D scene editor",
        "caption": "Selected frame from the reviewed reconstruction recording.",
        "kind": "landscape"
      }
    ],
    "videos": [
      {
        "src": "assets/media/fvdb-regeneration-highlight.mp4",
        "poster": "assets/images/fvdb-regeneration-poster.jpg",
        "label": "FVDB scene regeneration",
        "duration": "18 sec",
        "caption": "Short excerpt showing a reconstructed sparse scene from several viewpoints."
      },
      {
        "src": "assets/media/pointcloud-reconstruction-highlight.mp4",
        "poster": "assets/images/pointcloud-poster.jpg",
        "label": "Point-cloud reconstruction inspection",
        "duration": "18 sec",
        "caption": "The clearest segment from the uploaded reconstruction recording, showing geometry and viewpoint inspection."
      }
    ]
  },
  "eval": {
    "title": "Mini Eval for Real-Data Data-Science Agents",
    "short": "Ten Harbor tasks built from real tabular, text, image, and file-system data, with deterministic checks for the artifacts a data-science agent is expected to produce.",
    "image": "assets/images/data-eval.svg",
    "category": "Agent Evaluation · Applied AI",
    "year": "2026",
    "role": "Evaluation designer & engineer",
    "readingTime": "9 min read",
    "github": "https://github.com/pateldhruv1672/data_sci_eval_dhruv",
    "stack": [
      "Harbor",
      "Gemini 3.5 Flash",
      "Docker",
      "Python",
      "Pytest",
      "Kaggle datasets",
      "Trajectory analysis"
    ],
    "facts": [
      {
        "label": "Task suite",
        "value": "10 real-data tasks"
      },
      {
        "label": "Evaluation",
        "value": "Oracle · NOP · 3 model trials"
      },
      {
        "label": "Difficulty result",
        "value": "20% deterministic pass@3"
      }
    ],
    "lead": "I built this evaluation to check whether an agent can actually finish data-science work—not whether its final answer sounds convincing. The verifier looks at files, schemas, values, and execution traces after the run.",
    "problem": "The target model could produce plausible analysis while missing required CSV or JSON files, changing a business definition between questions, or mishandling image and file-system tasks. I needed tasks that preserve those failure modes and score them reproducibly.",
    "chapters": [
      {
        "title": "Ten tasks from real datasets",
        "paragraphs": [
          "The suite uses Hotel Booking Demand, Women’s E-Commerce Clothing Reviews, and Pokémon Images. The tasks cover tabular analysis, text-plus-tabular reasoning, image and file-system work, and multi-query workflows.",
          "I did not add synthetic rows, labels, images, or charts. The data remains close to the distribution an applied data-science agent would see."
        ]
      },
      {
        "title": "Each task includes its own verifier",
        "paragraphs": [
          "Every Harbor task includes an instruction, containerized environment, tests, and a reference solution. The official reward is based on the post-execution state, not on the agent’s explanation.",
          "Deterministic checks validate required files, schemas, values, and invariants. Semantic scoring is used only as an additional diagnostic where an exact match is not enough."
        ]
      },
      {
        "title": "Repeated trials expose reliability",
        "paragraphs": [
          "I ran oracle and no-op baselines to validate the tasks, then captured three Gemini trials per task. The repository stores messages, tool calls, observations, actions, and final outputs for each trial.",
          "The deterministic pass@3 result was 2 of 10, or 20%. That was below the assignment’s 30% difficulty ceiling and left clear room for prompt, scaffold, or post-training improvements."
        ]
      },
      {
        "title": "The useful output is the failure record",
        "paragraphs": [
          "A single score does not explain what to fix. The submission includes task definitions, logs, trajectories, deterministic scores, semantic scores, and reports.",
          "That makes it possible to identify definition drift, missing artifacts, wrong file formats, and modality-specific failures without rerunning the entire benchmark."
        ]
      }
    ],
    "system": [
      "Harbor defines the instruction, sandbox, agent, trajectory, and verifier for each task.",
      "Real datasets and dependencies are mounted into isolated task environments.",
      "Oracle and no-op runs validate the task and provide upper and lower behavior checks.",
      "Three Gemini trials per task are executed and stored with full trajectories.",
      "Deterministic tests produce the official pass/fail result; semantic scoring adds diagnostics.",
      "Aggregation scripts produce pass@k summaries and a reviewable report."
    ],
    "unique": "The official score comes from the artifacts and final environment state. A polished final message cannot compensate for a missing file, wrong schema, or incorrect value.",
    "impact": [
      "Built ten complete Harbor tasks across tabular, text, image, and file-system modalities.",
      "Validated every task with oracle, no-op, and repeated model trials.",
      "Captured trajectories that can be used for targeted agent debugging or post-training work.",
      "Reached a deterministic pass@3 of 20%, preserving the required evaluation headroom."
    ],
    "gallery": [
      {
        "src": "assets/images/data-eval.svg",
        "alt": "Diagram of parallel agent trajectories and verifier checkpoints",
        "caption": "The benchmark separates the agent trajectory from deterministic artifact verification.",
        "kind": "illustration"
      }
    ],
    "videos": []
  },
  "photos": {
    "title": "Big Photos — Distributed Photo Intelligence",
    "short": "An 11-container photo platform that stores MIRFLICKR-25K in HDFS, processes it with Spark, serves a MobileNetV3 classifier with Ray Serve, and supports vector search with HNSW.",
    "image": "assets/images/big-photos.svg",
    "category": "Distributed ML · Computer Vision",
    "year": "2026",
    "role": "ML platform engineer",
    "readingTime": "10 min read",
    "github": "https://github.com/pateldhruv1672/Big-photos",
    "stack": [
      "React",
      "FastAPI",
      "Kafka KRaft",
      "HDFS",
      "Spark",
      "Ray Serve",
      "MobileNetV3",
      "Ollama/LLaVA",
      "HNSW",
      "Parquet",
      "Docker"
    ],
    "facts": [
      {
        "label": "Runtime",
        "value": "11 Docker services"
      },
      {
        "label": "Dataset",
        "value": "MIRFLICKR-25K"
      },
      {
        "label": "Vision task",
        "value": "24-class multilabel classification"
      }
    ],
    "lead": "I built Big Photos to work on the systems around a vision model: ingestion, storage, events, batch processing, serving, retrieval, APIs, and a frontend. The model is one service in the platform, not the entire project.",
    "problem": "Batch ingestion and user uploads follow different paths. Images, labels, captions, embeddings, and metadata have to stay consistent, while training, inference, search, and web traffic have different scaling and failure modes.",
    "chapters": [
      {
        "title": "A user action crosses several services",
        "paragraphs": [
          "The React frontend exposes gallery, semantic search, stories, and uploads. FastAPI provides the product API. Kafka carries upload and processing events. HDFS stores raw images and derived files. Spark produces analytics. Ray Serve hosts inference, and HNSW serves vector similarity.",
          "The services are split by operational responsibility, but the path from an uploaded image to searchable output remains traceable."
        ]
      },
      {
        "title": "Batch ingestion and live uploads use separate paths",
        "paragraphs": [
          "The MIRFLICKR-25K batch path loads images and annotations into HDFS and uses Spark to create metadata and exploratory outputs. Enrichment adds captions, categories, and embeddings, with dataset tags available as a fallback when the local vision-language model is unavailable.",
          "The upload consumer handles the live path: persist the image, run classification, generate an embedding, update HNSW, write metadata, and publish the resulting event."
        ]
      },
      {
        "title": "Model serving stays outside the web API",
        "paragraphs": [
          "A MobileNetV3 Small model is fine-tuned for 24-class multilabel classification and served through Ray Serve. FastAPI calls that serving endpoint instead of loading and managing the model inside the web process.",
          "That keeps model lifecycle, inference scaling, and API traffic separate while preserving a clear request and response contract."
        ]
      },
      {
        "title": "Search combines metadata and embeddings",
        "paragraphs": [
          "Metadata and captions support filters and text-based browsing. Sentence-transformer embeddings feed an HNSW index for semantic similarity.",
          "The product can therefore offer gallery browsing, search, and generated stories without forcing one representation to handle every interaction."
        ]
      }
    ],
    "system": [
      "HDFS stores raw images, metadata, uploads, model artifacts, and aggregate outputs.",
      "Spark runs distributed EDA, metadata generation, and aggregate jobs.",
      "Ollama/LLaVA enriches images when available; dataset annotations provide a fallback.",
      "MobileNetV3 Small is served through Ray Serve for multilabel classification.",
      "Sentence-transformer embeddings are stored in an HNSW index for semantic retrieval.",
      "Kafka separates upload, labeling, failure, and downstream processing events.",
      "FastAPI and React expose gallery, search, story, upload, and metrics workflows."
    ],
    "unique": "The repository shows the complete path around the model: storage, batch jobs, events, inference, vector search, APIs, and the frontend are all explicit services with replaceable interfaces.",
    "impact": [
      "Integrated eleven Docker services into one photo-processing workflow.",
      "Connected MIRFLICKR-25K, Spark analytics, Ray Serve inference, HNSW search, and a React interface.",
      "Implemented both batch ingestion and an event-driven upload consumer.",
      "Kept model, storage, streaming, and product boundaries independent enough to test separately."
    ],
    "gallery": [
      {
        "src": "assets/images/big-photos.svg",
        "alt": "Distributed photo intelligence architecture illustration",
        "caption": "The platform connects storage, streaming, batch analytics, model serving, retrieval, and product APIs.",
        "kind": "illustration"
      }
    ],
    "videos": []
  },
  "degree": {
    "title": "The Last Degree — Labor-Market ETL",
    "short": "A daily Airflow pipeline that pulls US job listings from Adzuna, cleans and deduplicates them, and loads Snowflake tables used for salary, skill-demand, and education-ROI analysis.",
    "image": "assets/images/last-degree-overview.png",
    "coverFit": "contain",
    "category": "Data Engineering · Analytics",
    "year": "2025",
    "role": "Data platform engineer",
    "readingTime": "7 min read",
    "github": "https://github.com/pateldhruv1672/THE-LAST-DEGREE",
    "stack": [
      "Apache Airflow",
      "Snowflake",
      "dbt",
      "Adzuna API",
      "Python",
      "SQL",
      "Docker"
    ],
    "facts": [
      {
        "label": "Source",
        "value": "Adzuna job listings API"
      },
      {
        "label": "Target scale",
        "value": "~1M active US listings"
      },
      {
        "label": "Schedule",
        "value": "Daily · 2 AM UTC"
      }
    ],
    "lead": "I wanted the education-ROI analysis to start from a repeatable labor-market dataset rather than a one-time CSV. The linked repository focuses on the ETL layer; the screenshots show the dashboard built on top of that data model.",
    "problem": "The source API is paginated and rate-limited, and its records contain HTML, missing salaries, inconsistent locations, duplicate postings, and dates that need validation. Those issues have to be handled before a dashboard or forecasting model can be trusted.",
    "chapters": [
      {
        "title": "Extraction handles the external API explicitly",
        "paragraphs": [
          "The Airflow task fetches Adzuna pages, reads credentials from configuration, respects a configurable page limit, and keeps the fields needed downstream: title, employer, salary range, description, posting date, location, and category.",
          "Pagination and rate limits are treated as normal pipeline conditions rather than hidden inside a single script."
        ]
      },
      {
        "title": "Transformation keeps business definitions stable",
        "paragraphs": [
          "The transformation stage removes HTML, normalizes salary fields, parses posting dates, extracts location fields, and removes duplicates. Extraction and transformation are separate so a source change does not silently change an analytical definition."
        ]
      },
      {
        "title": "Snowflake loading is restartable",
        "paragraphs": [
          "Records land in staging tables before merge-based upserts into the analytics tables. Load statistics make each run inspectable, while job_id and load_date preserve identity and ingestion context.",
          "SQL and dbt models expose skill demand, salary trends, company hiring, category distribution, and geography for the dashboard and later ROI analysis."
        ]
      },
      {
        "title": "The dashboard uses the warehouse outputs",
        "paragraphs": [
          "The supplied screenshots show the graduate ROI overview and the WARN Act layoff monitor. They combine job volume, earnings, university comparisons, industry stability, company layoffs, and monthly trends.",
          "The dashboard is a separate presentation layer; the repository link on this page points to the Airflow and Snowflake pipeline that prepares the data."
        ]
      }
    ],
    "system": [
      "Airflow schedules extraction, transformation, and loading as separate retryable tasks.",
      "The extractor handles Adzuna pagination, credentials, rate limits, and field selection.",
      "The transformer cleans descriptions, normalizes salary, validates dates, parses location, and deduplicates records.",
      "Snowflake staging tables isolate incoming data before merge-based upserts.",
      "SQL and dbt models expose salary, skill, company, location, and category views for analysis."
    ],
    "unique": "The dashboard is backed by a scheduled, restartable ingestion path. The project keeps source cleanup, warehouse loading, and analytical definitions visible instead of hiding them inside the UI.",
    "impact": [
      "Designed daily ingestion for the Adzuna source, which reports roughly one million active US listings.",
      "Made job data queryable by skill, employer, category, geography, salary, and time.",
      "Built the Snowflake foundation used by the ROI and layoff-monitor dashboards.",
      "Documented the schema, Airflow setup, pipeline components, and operating steps in the repository."
    ],
    "gallery": [
      {
        "src": "assets/images/last-degree-overview.png",
        "alt": "The Last Degree graduate ROI intelligence dashboard",
        "caption": "Graduate ROI overview combining earnings, job volume, layoff risk, and university comparisons.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree-layoff.png",
        "alt": "The Last Degree layoff risk monitor dashboard",
        "caption": "WARN Act monitoring, industry stability scores, company layoff counts, and monthly trends.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree.svg",
        "alt": "Airflow to Snowflake labor market pipeline diagram",
        "caption": "Adzuna extraction, transformation, Snowflake loading, and analytical models.",
        "kind": "illustration"
      }
    ],
    "videos": []
  },
  "pinecone": {
    "title": "Pinecone Semantic Search Pipeline",
    "short": "A Dockerized Airflow DAG that downloads Medium articles, cleans the text, generates 384-dimensional embeddings, loads Pinecone, and runs a query to verify retrieval.",
    "image": "assets/images/pinecone-search.svg",
    "category": "Retrieval · Data Platforms",
    "year": "2025",
    "role": "ML & data engineer",
    "readingTime": "6 min read",
    "github": "https://github.com/pateldhruv1672/Pinecone-Search-Engine",
    "stack": [
      "Apache Airflow",
      "Pinecone",
      "all-MiniLM-L6-v2",
      "Sentence Transformers",
      "Docker Compose",
      "Python",
      "Pandas"
    ],
    "facts": [
      {
        "label": "Embedding",
        "value": "all-MiniLM-L6-v2"
      },
      {
        "label": "Index",
        "value": "384 dimensions · dot product"
      },
      {
        "label": "Validation",
        "value": "Pipeline-level search query"
      }
    ],
    "lead": "I built this as a pipeline rather than a notebook so each failure has a clear boundary: source data, preprocessing, embedding, index creation, upsert, or query validation.",
    "problem": "A semantic-search demo can finish without proving that search works. The source dataset may change, the embedding size may not match the index, or an upsert may succeed while result metadata is missing. I made those assumptions part of the DAG.",
    "chapters": [
      {
        "title": "The DAG records the full retrieval workflow",
        "paragraphs": [
          "The workflow downloads the Medium-article dataset, preprocesses text, creates or resets the Pinecone index, generates embeddings, upserts vectors with metadata, and runs a test query. Each stage can be retried and inspected independently."
        ]
      },
      {
        "title": "Embedding and index settings must match",
        "paragraphs": [
          "all-MiniLM-L6-v2 produces 384-dimensional sentence embeddings, so the Pinecone index is created with the same dimension and dot-product similarity. The contract is visible in the pipeline rather than inferred from a notebook cell."
        ]
      },
      {
        "title": "A query is part of validation",
        "paragraphs": [
          "The final task sends a semantic query and logs returned IDs, similarity scores, and titles. A successful index creation or vector upsert is not counted as proof that retrieval is correct."
        ]
      }
    ],
    "system": [
      "Docker Compose provides a repeatable Airflow environment and retrieval dependencies.",
      "Airflow downloads and preprocesses the article data.",
      "The DAG initializes a 384-dimensional Pinecone index with dot-product similarity.",
      "Sentence Transformers generates embeddings and stores result metadata.",
      "A final task queries the index and logs the returned records."
    ],
    "unique": "The DAG tests the retrieval path end to end. Index creation, vector loading, metadata, and a real query are all checked in the same run.",
    "impact": [
      "Converted the semantic-search workflow into restartable Airflow tasks.",
      "Made data, embedding, index, and query failures independently visible.",
      "Verified retrieval with an actual query and returned metadata.",
      "Documented setup and troubleshooting for index readiness, API configuration, and dimension mismatches."
    ],
    "gallery": [
      {
        "src": "assets/images/pinecone-search.svg",
        "alt": "Semantic search pipeline diagram",
        "caption": "Medium articles flow through preprocessing, embeddings, Pinecone indexing, and a verification query.",
        "kind": "illustration"
      }
    ],
    "videos": []
  },
  "avian": {
    "title": "Avian Journeys — Global Migration Analytics",
    "short": "Python exploratory analysis and a five-page Power BI report built from 10,000 migration records and 42 variables.",
    "image": "assets/images/avian-cover.webp",
    "category": "Data Visualization · BI",
    "year": "2025",
    "role": "Data analyst & visualization designer",
    "readingTime": "7 min read",
    "github": "https://github.com/pateldhruv1672/Data-Visualization",
    "stack": [
      "Python",
      "Pandas",
      "Seaborn",
      "Matplotlib",
      "Power BI",
      "Geospatial analysis"
    ],
    "facts": [
      {
        "label": "Dataset",
        "value": "10,000 journeys"
      },
      {
        "label": "Feature space",
        "value": "42 variables"
      },
      {
        "label": "Delivery",
        "value": "EDA notebook + 5-page Power BI report"
      }
    ],
    "lead": "I used the notebook to decide which relationships were worth showing, then organized the Power BI report around the questions a viewer would ask: where birds travel, which habitats appear most often, what interrupts a journey, and how patterns change by season and species.",
    "problem": "The dataset mixes species, geography, habitat, weather, distance, speed, altitude, duration, success, and interruption fields. A collection of unrelated charts would make it difficult to compare those dimensions or understand how the report pages relate to one another.",
    "chapters": [
      {
        "title": "The notebook establishes the data definitions",
        "paragraphs": [
          "The Python analysis checks missing values, outliers, distributions, migration success, habitat, weather, speed, altitude, and distance before the dashboard is designed. The Interrupted field receives explicit cleanup instead of being dropped without explanation.",
          "The same cleaned dataset and definitions are then used in Power BI."
        ]
      },
      {
        "title": "The first page gives the reader context",
        "paragraphs": [
          "The overview page introduces the dataset and reports total journeys, success rate, average distance, speed, duration, and maximum altitude. It gives the remaining pages a common baseline."
        ]
      },
      {
        "title": "Geography, habitat, and species share one view",
        "paragraphs": [
          "The second page combines the world map, habitat counts, and species totals. A viewer can move from location to habitat and then to species without switching reports."
        ]
      },
      {
        "title": "Environment and season answer separate questions",
        "paragraphs": [
          "The environmental page compares average conditions, migration drivers, and interruption categories. The seasonal page looks at monthly departures, seasonal shares, distance, and success by species.",
          "Organizing the report by question keeps the dashboard easier to follow than grouping visuals only by chart type."
        ]
      }
    ],
    "system": [
      "Pandas cleaning and EDA check missingness, outliers, distributions, and relationships.",
      "Matplotlib and Seaborn are used to inspect candidate relationships before dashboard design.",
      "Power BI models the cleaned data across five report pages.",
      "Geospatial visuals use start and end coordinates to compare regions.",
      "Species, habitat, weather, and season filters support drill-down across the report."
    ],
    "unique": "The notebook and the Power BI report use the same cleaned data and definitions. The report pages are organized around analytical questions rather than a list of chart types.",
    "impact": [
      "Analyzed 10,000 migration records across 42 variables.",
      "Built a five-page report covering overview, geography, environment, seasonality, and species outcomes.",
      "Combined maps, filters, KPI cards, and comparative charts in a consistent report structure.",
      "Delivered the notebook, Power BI file, presentation, and repository documentation as a DATA 230 team project."
    ],
    "gallery": [
      {
        "src": "assets/images/avian/dashboard-118.webp",
        "alt": "Avian Journeys report overview and key statistics",
        "caption": "Report overview: narrative context and high-level migration statistics.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/avian/dashboard-119.webp",
        "alt": "Avian Journeys map species and habitat dashboard page",
        "caption": "Geographic distribution, habitat counts, and species comparison.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/avian/dashboard-120.webp",
        "alt": "Avian Journeys environmental factors dashboard page",
        "caption": "Environmental conditions, migration drivers, and interruption categories.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/avian/dashboard-121.webp",
        "alt": "Avian Journeys seasonal migration and success dashboard page",
        "caption": "Seasonal dynamics, flight distance, and migration success by species.",
        "kind": "landscape"
      }
    ],
    "videos": []
  }
};

window.PROJECT_ARCHIVE = [
  {
    "title": "AutoQuote",
    "note": "Prototype for uploading a vehicle-damage photo and finding nearby repair shops through a map-based interface.",
    "stack": "React · TypeScript · Express · Maps · VAPI",
    "image": "assets/images/autoquote-app.png",
    "url": "https://github.com/pateldhruv1672/auto-quote"
  },
  {
    "title": "Stock Forecasting Pipeline",
    "note": "Two Airflow DAGs for market-data ingestion and Snowflake-based model training and forecasting, with a small ticker-search interface.",
    "stack": "Airflow · Snowflake ML · yfinance · Python",
    "image": "assets/images/stock-forecasting.png",
    "url": "https://github.com/pateldhruv1672/Stock-Price-Forecasting-using-Snowflake-and-Airflow"
  },
  {
    "title": "AI Data Insights",
    "note": "React and TypeScript analytics interface using Supabase, TanStack Query, Recharts, Tailwind, and reusable components.",
    "stack": "React · TypeScript · Supabase · Recharts",
    "url": "https://github.com/pateldhruv1672/ai-data-insights"
  },
  {
    "title": "LinkedIn AI Experiments",
    "note": "Experiments with agent workflows and service integration. I list this as exploratory work, not a deployed product.",
    "stack": "Agents · APIs · Workflow orchestration",
    "url": "https://github.com/pateldhruv1672/Linkedin_AI"
  }
];
