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
    "title": "Sparky: Persistent Navigation and Agentic Supervision for Unitree Go2",
    "short": "A ROS 2 Jazzy workspace that separates robot bring-up, mapping, saved-map localization, semantic memory, Nav2 execution, agent supervision, and confirmation-gated voice commands.",
    "image": "assets/images/go2-navigation-poster.jpg",
    "category": "Embodied AI · Autonomous Robotics",
    "year": "2025–Present",
    "role": "Research assistant · Robotics systems engineer",
    "readingTime": "15 min read",
    "github": "https://github.com/pateldhruv1672/go2_ros/tree/teach_repair",
    "demoIntro": "Four short clips show the runtime/map view, two indoor navigation passes, and the motion-skills controller. Every Go2 clip keeps the original stereo audio.",
    "links": [
      {
        "label": "teach_repair branch",
        "url": "https://github.com/pateldhruv1672/go2_ros/tree/teach_repair",
        "meta": "Current implementation"
      },
      {
        "label": "Architecture diagrams",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/docs/ARCHITECTURE.md",
        "meta": "docs/ARCHITECTURE.md"
      },
      {
        "label": "Launch ownership contract",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/CURRENT_LAUNCH_CONTRACT.md",
        "meta": "Base, teach, and resume ownership"
      },
      {
        "label": "Session format",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/SESSION_FORMAT_V1.md",
        "meta": "Persistent map and semantic artifacts"
      },
      {
        "label": "TF, odometry, and topic contract",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/TOPIC_TF_ODOM_CONTRACT.md",
        "meta": "Runtime frame and topic ownership"
      },
      {
        "label": "Implementation validation",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/IMPLEMENTATION_VALIDATION.md",
        "meta": "Validation and known gaps"
      },
      {
        "label": "LangGraph capability status",
        "url": "https://github.com/pateldhruv1672/go2_ros/blob/teach_repair/LANGGRAPH_CAPABILITY_STATUS.md",
        "meta": "Implemented vs. planned agent behavior"
      }
    ],
    "stack": [
      "ROS 2 Jazzy",
      "Unitree Go2 WebRTC",
      "CycloneDDS",
      "Nav2",
      "SLAM Toolbox",
      "AMCL",
      "LangGraph",
      "OpenRouter",
      "Gemini 2.5 Flash",
      "Python",
      "C++"
    ],
    "facts": [
      {
        "label": "Runtime layers",
        "value": "Base · Teach · Resume · Agent · Voice"
      },
      {
        "label": "Saved session",
        "value": "Map · Places · Metadata · Spawn"
      },
      {
        "label": "Motion authority",
        "value": "Nav2 + collision monitor"
      }
    ],
    "lead": "Sparky is the robotics workspace I use to turn a Unitree Go2 from a sensor-connected platform into a repeatable autonomy system. The main engineering problem is not sending one navigation goal; it is preserving ownership of TF, localization, saved state, motion, and recovery across mapping, restart, and agent-driven operation.",
    "problem": "The early stack could complete isolated demos, but a restart, duplicate launch, stale process, or second map-to-odom publisher could invalidate the robot state without an obvious error. I reorganized the workspace around explicit launch modes and contracts: one layer owns robot and sensor bring-up, one owns mapping, one owns saved-map localization, and higher-level semantic, agent, and voice components are allowed to act only after the navigation layer reports a healthy state.",
    "chapters": [
      {
        "title": "The workspace is a system, not a single ROS package",
        "paragraphs": [
          "The teach_repair branch contains separate packages for the Unitree driver, semantic navigation, memory, typed navigation tools, perception, LangGraph orchestration, agentic motion skills, semantic voxel memory, remote teleoperation, COLMAP processing, and the Omi voice bridge. That package boundary is intentional: hardware transport, navigation state, semantic reasoning, and human interaction fail in different ways and need to be tested independently.",
          "The base driver uses the Go2 WebRTC path and publishes a stable ROS 2 surface for the rest of the workspace. CycloneDDS, a fixed ROS domain, and one project environment reduce discovery and Python-environment ambiguity between terminals."
        ],
        "bullets": [
          "Core robot topics include camera images, laser scan, odometry, TF, and the final velocity-command interface.",
          "The repository keeps reusable launch wrappers under scripts/ instead of relying on long ad-hoc terminal commands.",
          "The same topic contract is intended to be mirrored by simulation so the autonomy layers do not depend on a second API."
        ]
      },
      {
        "title": "Base, teach, and resume have different owners",
        "paragraphs": [
          "Base mode owns the driver, robot description, sensors, TF, odometry, scan conversion, and RViz. Teach mode adds a single SLAM owner. Resume mode does not restart live SLAM; it loads a saved map, starts AMCL, brings up the no-docking Nav2 stack, and starts the semantic navigation node in resume mode.",
          "This prevents the most damaging class of navigation bug in the workspace: two nodes competing to publish map to odom. The launch sequence also delays Nav2 until saved-map localization has had time to initialize instead of letting planners start against an incomplete transform tree."
        ],
        "bullets": [
          "BASE_MODE=base is the sensor and robot foundation.",
          "Teach mode runs SLAM and records semantic places against the live map.",
          "Resume mode uses map_server and AMCL as the saved-map localization path.",
          "The current resume path retimestamps /scan into /scan_nav for AMCL, costmaps, collision monitoring, and semantic navigation."
        ]
      },
      {
        "title": "A saved session is the unit of persistent state",
        "paragraphs": [
          "Teach mode does not save a map and semantic labels as unrelated outputs. A resume-ready session groups map.yaml, map.pgm, places.yaml, and session.yaml under one session directory. A stored spawn reference provides a known semantic and geometric anchor when the robot returns to the space.",
          "The semantic layer can propose labels from camera observations, but navigation ultimately resolves a name to a metric pose in the selected map. This keeps the human-facing command and the controller-facing goal connected to the same state snapshot."
        ],
        "bullets": [
          "Sessions are stored under ~/.ros/go2_semantic_nav_sessions/.",
          "Map and place files are written together so resume mode can audit completeness before launching.",
          "restore_spawn_on_start provides a controlled re-entry path instead of assuming localization is already correct."
        ]
      },
      {
        "title": "Agentic behavior is an overlay on a healthy Nav2 stack",
        "paragraphs": [
          "The agentic observe/explore launch is started after the base stack is healthy, and motion is disabled first. The current configuration can use an OpenRouter-hosted Gemini 2.5 Flash model for open-vocabulary observations and VLM checkpoints while ROS nodes expose map, odometry, scan, camera, memory, and tool state.",
          "The agent does not publish velocity commands. It selects bounded tools, inspects preconditions, receives action feedback, and reports status through dedicated stream, status, and speech topics. Nav2 remains the execution authority and the collision monitor can block motion independently of the language layer."
        ],
        "bullets": [
          "Observe-only commands can inspect the current scene and recommend a safe direction without moving the robot.",
          "Dynamic-obstacle tracking is disabled by default in the documented launch while the base resume stack is stabilized.",
          "Motion stays disabled until localization, Nav2 lifecycle nodes, action servers, and sensor freshness checks pass."
        ]
      },
      {
        "title": "Voice commands are transcript-first and confirmation-gated",
        "paragraphs": [
          "The Omi integration currently accepts transcript input, routes it through an intent gate, and can produce TTS and tour behavior. Commands that cause motion require confirmation. Stop, halt, freeze, emergency stop, and cancel-navigation phrases bypass the normal confirmation flow and immediately request zero velocity and a navigation stop.",
          "Tours are data, not hard-coded prompts. The tour router loads a JSON route that references semantic places, narration, and checkpoint metadata. If the route file is missing or resume mode is unavailable, it refuses rather than inventing a destination."
        ]
      },
      {
        "title": "The branch documents contracts and known gaps",
        "paragraphs": [
          "The repository maintains architecture diagrams plus separate documents for the launch contract, session format, TF/odometry/topic ownership, implementation validation, and LangGraph capability status. I use these files as operational contracts: they record which process owns each layer, which artifacts must exist, and which capabilities are implemented versus still experimental.",
          "The current branch is deliberately conservative. Global live obstacles can be disabled while debugging map-based planning; agentic motion can remain off; and a clean-restart command removes stale driver, SLAM, AMCL, Nav2, RViz, semantic, and voice processes before another run."
        ]
      },
      {
        "title": "How I validate a run",
        "paragraphs": [
          "I check the system from the bottom up: sensor topics and rates, odometry, TF ownership, lifecycle state, NavigateToPose availability, costmap behavior, action feedback, then semantic and voice state. RViz is used as instrumentation rather than decoration; paths, maps, markers, and localization state need to agree with what the physical robot is doing.",
          "A run is not counted as successful because the robot moved. The loaded session must match the map, localization must remain valid, Nav2 must own motion, the collision monitor must stay healthy, and the recorded logs must make a failure reproducible."
        ]
      }
    ],
    "system": [
      "The Unitree WebRTC driver publishes LiDAR, camera, IMU, odometry, joint state, TF, and the final velocity-command interface.",
      "Point-cloud processing produces the /scan contract consumed by SLAM, AMCL, costmaps, collision monitoring, and semantic navigation.",
      "Teach mode runs one SLAM owner and writes map.yaml, map.pgm, places.yaml, session.yaml, and the spawn reference into one session.",
      "Resume mode loads the selected map, starts AMCL, validates map-to-odom-to-base, and then activates the Nav2 no-docking stack.",
      "Memory and perception packages store semantic places, object observations, VLM checkpoints, and higher-level context without taking over control.",
      "LangGraph-style supervision resolves commands into typed tools, checks readiness, submits Nav2 actions, and handles bounded recovery and reporting.",
      "The Omi transcript bridge applies intent classification and confirmation rules before forwarding motion or tour commands.",
      "RViz, lifecycle queries, action feedback, agent streams, voice verification topics, and clean-restart scripts provide the evidence used to debug a run."
    ],
    "unique": "The differentiator is ownership. A language model may select a saved place or request a bounded recovery, but it cannot bypass localization, Nav2, confirmation, or collision monitoring. Persistent state and runtime safety are treated as first-class parts of the autonomy architecture.",
    "impact": [
      "Separated base, teach, resume, agentic, and voice launch layers so failures can be isolated instead of hidden inside one monolithic launch.",
      "Defined a resume-ready session containing the occupancy map, semantic places, session metadata, and a spawn anchor.",
      "Made AMCL the saved-map localization owner and prevented live SLAM from competing for map-to-odom during resume runs.",
      "Added typed Nav2 tools, observe-only agent operation, action feedback, bounded recovery, and motion-disabled startup for safe integration testing.",
      "Added transcript-first voice commands, explicit confirmation for motion, immediate stop handling, and JSON-backed semantic tour routes.",
      "Documented architecture, launch ownership, session format, TF/topic contracts, validation status, and LangGraph capability boundaries in the repository."
    ],
    "gallery": [
      {
        "src": "assets/images/go2-system-architecture.svg",
        "alt": "Architecture diagram for Sparky Go2 base, teach, resume, semantic, agent, voice, and Nav2 layers",
        "caption": "System architecture derived from the teach_repair launch and topic contracts.",
        "kind": "illustration"
      },
      {
        "src": "assets/images/go2-runtime-map-poster.jpg",
        "alt": "Runtime terminals and map visualization for the Go2 ROS 2 stack",
        "caption": "Runtime inspection of logs, map state, and the navigation graph.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/go2-navigation-poster.jpg",
        "alt": "Unitree Go2 traversing the SJSU Robotics and Digital Twin Lab during a navigation run",
        "caption": "Autonomous indoor navigation on the real Go2 platform.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/go2-motion-poster.jpg",
        "alt": "Unitree Go2 executing a motion skill in the laboratory",
        "caption": "Hardware motion-skill execution in the lab.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/go2-lab.webp",
        "alt": "Unitree G1 and Go2 robots inside the SJSU Robotics and Digital Twin Lab",
        "caption": "The Robotics and Digital Twin Lab hardware environment.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/lab/20260526_203953.webp",
        "alt": "Unitree robots and workstations in the SJSU robotics laboratory",
        "caption": "Go2, G1, and manipulation platforms in the shared research space.",
        "kind": "landscape"
      }
    ],
    "videos": [
      {
        "src": "assets/media/go2-runtime-map-highlight.mp4",
        "poster": "assets/images/go2-runtime-map-poster.jpg",
        "label": "Runtime and map inspection",
        "duration": "16 sec",
        "caption": "The ROS 2 runtime, terminal state, and map view used before the physical run. Original stereo audio is preserved.",
        "hasAudio": true
      },
      {
        "src": "assets/media/go2-navigation-highlight.mp4",
        "poster": "assets/images/go2-navigation-poster.jpg",
        "label": "Autonomous navigation pass",
        "duration": "18 sec",
        "caption": "A real Go2 navigation pass across the Digital Twin Lab. Original stereo audio is preserved.",
        "hasAudio": true
      },
      {
        "src": "assets/media/go2-repeat-run-highlight.mp4",
        "poster": "assets/images/go2-repeat-run-poster.jpg",
        "label": "Repeat indoor traversal",
        "duration": "20 sec",
        "caption": "A later section of the same recording showing another traversal in the lab. Original stereo audio is preserved.",
        "hasAudio": true
      },
      {
        "src": "assets/media/go2-motion-skills-highlight.mp4",
        "poster": "assets/images/go2-motion-poster.jpg",
        "label": "Go2 motion skills",
        "duration": "20 sec",
        "caption": "Hardware motion behavior from the separate Go2 motion-skills recording. Original stereo audio is preserved.",
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
    "title": "The Last Degree — Graduate ROI Intelligence System",
    "short": "A cloud-native, risk-adjusted degree ROI platform that joins university outcomes with live job demand, BLS projections, and WARN layoff signals through Airflow, Snowflake, dbt, React, and a SQL AI agent.",
    "image": "assets/images/last-degree-overview.png",
    "coverFit": "contain",
    "category": "Data Engineering · Analytics Engineering · AI",
    "year": "2025",
    "role": "Team project · Data platform and analytics engineering",
    "readingTime": "13 min read",
    "github": "https://github.com/pateldhruv1672/THE-LAST-DEGREE",
    "links": [
      {
        "label": "Frontend application repository",
        "url": "https://github.com/pateldhruv1672/THE-LAST-DEGREE-APP",
        "meta": "React application"
      },
      {
        "label": "Analytics frontend repository",
        "url": "https://github.com/pateldhruv1672/ai-data-insights",
        "meta": "Dashboard and data-insight interface"
      },
      {
        "label": "Live application",
        "url": "https://thelastdegree.dev/",
        "meta": "Graduate ROI intelligence experience"
      },
      {
        "label": "Technical report",
        "url": "assets/docs/the-graduate-roi-intelligence-system.pdf",
        "meta": "26-page architecture and implementation report"
      }
    ],
    "stack": [
      "Apache Airflow",
      "Snowflake",
      "dbt",
      "React",
      "Apache Superset",
      "Python",
      "SQL",
      "Docker",
      "College Scorecard API",
      "Adzuna API",
      "BLS data",
      "WARN notices"
    ],
    "facts": [
      {
        "label": "Data pillars",
        "value": "College · Jobs · BLS · WARN"
      },
      {
        "label": "Daily job ingestion",
        "value": "~22,500 listings per run"
      },
      {
        "label": "Shared taxonomy",
        "value": "25 occupation groups"
      }
    ],
    "lead": "The Last Degree is a graduate-program decision system built around a simple limitation of conventional ROI rankings: tuition and historical earnings do not describe what the labor market looks like now. The project combines education outcomes with current hiring demand, long-term employment projections, and layoff activity, then materializes those signals into a queryable degree-and-industry outlook mart.",
    "problem": "The required data arrives from four unrelated domains and cannot be joined directly. College Scorecard describes institutions, Adzuna describes individual job postings, BLS publishes occupational projections, and WARN notices describe layoffs. The engineering challenge was to build a governed pipeline that could ingest each source at its own cadence, normalize the data, map labor-market records into one occupation taxonomy, and expose a risk-adjusted ROI model without burying the business logic inside the frontend.",
    "chapters": [
      {
        "title": "Four data sources contribute different parts of the decision",
        "paragraphs": [
          "College Scorecard provides the financial baseline: net price, student debt, completion measures, and earnings after entry. Adzuna supplies the live market signal through current job postings, salary ranges, locations, employers, categories, and descriptions. BLS adds a forward-looking view through employment levels and ten-year projections. WARN notices contribute the negative signal by recording mass layoffs and affected-worker counts.",
          "The sources run at different cadences. Job listings are ingested daily, BLS and WARN data are refreshed monthly, and institutional outcomes change more slowly. Keeping those schedules independent avoids treating every source as if it had the same freshness or reliability contract."
        ],
        "bullets": [
          "College Scorecard: cost, debt, completion, and long-horizon earnings.",
          "Adzuna: approximately 22,500 listings per daily run across about 30 categories.",
          "BLS: roughly 834 macro occupations expanded into more than 5,000 granular title rows.",
          "WARN: company, location, layoff date, and affected-worker records used as a stability signal."
        ]
      },
      {
        "title": "Airflow owns extraction, structural cleanup, and reliable loading",
        "paragraphs": [
          "Apache Airflow is the control plane for the ingestion layer. Each source has a dedicated DAG and explicit task boundaries for setup, extraction, transformation, staging, merge, and quality checks. The pipelines use staging tables followed by MERGE operations so reruns can update existing records instead of blindly appending duplicates.",
          "Source-specific work stays in the ETL layer. College Scorecard requires nested JSON flattening, pagination, type conversion, and exponential backoff. Adzuna requires HTML removal, salary normalization, location parsing, pagination, and retry handling. BLS requires structural expansion from broad occupations to granular titles. WARN requires validation and numeric conversion of affected-worker counts."
        ]
      },
      {
        "title": "Snowflake separates raw ingestion, analytics, and history",
        "paragraphs": [
          "Snowflake is organized around distinct responsibilities rather than one catch-all schema. RAW tables preserve the normalized source records, ANALYTICS contains staging views and marts used by the application, and SNAPSHOTS retains historical model state. This separation makes it possible to inspect what arrived from a source independently from the business logic applied later.",
          "The source tables include COLLEGE_SCORECARD_DATA, JOB_LISTINGS, BLS_EMPLOYMENT_PROJECTIONS, and WARN_EVENTS. Their keys and timestamps preserve both domain identity and ingestion context for downstream debugging."
        ]
      },
      {
        "title": "dbt is the governed business-logic layer",
        "paragraphs": [
          "dbt models handle the analytical transformations inside Snowflake. Staging models standardize each domain and calculate initial metrics; mart models perform the cross-domain joins, tests, documentation generation, and final materialization. The Airflow dbt DAG runs dependency checks, staging models, the mart, snapshots, tests, and documentation as an ordered workflow.",
          "This keeps the ROI definitions version-controlled and testable. A source parser can change without silently redefining a metric, and the frontend does not need to reproduce complex joins in application code."
        ],
        "bullets": [
          "stg_institution calculates the financial ROI baseline.",
          "stg_job_demand aggregates listing volume and salary by occupation group.",
          "stg_layoff_risk aggregates affected workers by industry and period.",
          "stg_bls_projections maps granular occupations into the shared taxonomy.",
          "mart_degree_roi_and_industry_outlook is the query-optimized analytical product."
        ]
      },
      {
        "title": "A 25-group occupation taxonomy makes the domains joinable",
        "paragraphs": [
          "The central modeling problem is that universities, job postings, layoff events, and BLS projections do not share a natural primary key. The project introduces a standardized 25-occupation-group taxonomy as the common language for the three labor-market sources.",
          "The final mart starts with institution IDs crossed with the occupation groups. Institutional ROI metrics join through UnitID, while demand, layoffs, salaries, and BLS projections join through the occupation taxonomy. The resulting table can answer questions about a school and a career path in the same query."
        ]
      },
      {
        "title": "The score adjusts financial return with demand and layoff risk",
        "paragraphs": [
          "The analytical product is not a single historical earnings ranking. The report defines a Degree ROI Score that combines normalized earnings relative to cost, a weighted demand signal, and a penalty derived from layoff risk. The Layoff Risk Index compares aggregated WARN layoffs with active Adzuna job postings for the same occupation group.",
          "This design makes the score responsive to conflicting evidence. A field can have high salaries but receive a lower outlook when hiring demand is weak or layoffs are unusually high. BLS projections add a longer-horizon check so current posting volume is not treated as the entire career outlook."
        ],
        "bullets": [
          "ROI Score = normalized earnings / normalized cost × weighted demand × (1 - layoff risk).",
          "Layoff Risk Index = aggregated WARN layoffs / aggregated Adzuna job postings.",
          "The final table is materialized for low-latency dashboard and agent queries."
        ]
      },
      {
        "title": "The product layer serves dashboards and natural-language analysis",
        "paragraphs": [
          "The React application presents graduate ROI, active jobs, layoff risk, university comparisons, industry stability, and monthly trends. Superset provides additional analytical views such as institution ROI rankings, in-state versus out-of-state comparisons, employment mix, layoff share, and projected growth.",
          "A SQL AI agent sits above the analytical mart so non-technical users can ask questions in natural language. The agent is valuable because the mart already centralizes the semantics; it queries a governed model rather than generating SQL against unrelated raw tables."
        ]
      }
    ],
    "system": [
      "Airflow schedules independent College Scorecard, Adzuna, BLS, and WARN ingestion workflows.",
      "Source-specific ETL flattens JSON, cleans HTML, normalizes salaries and locations, expands occupational rows, and validates layoff counts.",
      "Snowflake RAW tables receive staged records through restartable MERGE operations.",
      "dbt staging models standardize each domain and calculate initial financial, demand, projection, and risk metrics.",
      "A 25-occupation-group taxonomy provides the shared dimension across job listings, projections, and layoff events.",
      "mart_degree_roi_and_industry_outlook cross-joins institutions with occupation groups and materializes the final risk-adjusted analytical model.",
      "React, Superset, and the SQL AI agent consume the mart for dashboards and natural-language analysis."
    ],
    "unique": "The distinguishing decision is to treat degree ROI as a governed, cross-domain data product rather than a frontend formula. Historical education outcomes, live job velocity, ten-year employment projections, and WARN layoffs are normalized separately, joined through an explicit occupation taxonomy, and materialized into one auditable mart.",
    "impact": [
      "Automated four heterogeneous data pipelines with source-specific schedules, retries, staging, MERGE loading, and data-quality checks.",
      "Processed approximately 22,500 active job listings per daily Adzuna run and expanded BLS source data into more than 5,000 granular occupation rows.",
      "Created a shared 25-group occupation taxonomy that connects demand, projection, and layoff signals to institution-level ROI metrics.",
      "Materialized a risk-adjusted degree-and-industry outlook mart used by dashboards, the React application, and a natural-language SQL agent.",
      "Documented the full architecture, raw schemas, dbt lineage, dashboard outputs, score logic, and future roadmap in a 26-page technical report."
    ],
    "gallery": [
      {
        "src": "assets/images/last-degree-overview.png",
        "alt": "The Last Degree graduate ROI intelligence dashboard",
        "caption": "The product overview combines ten-year earnings, active jobs, layoff risk, university coverage, job trends, and ROI comparisons.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree-layoff.png",
        "alt": "The Last Degree WARN layoff risk monitor",
        "caption": "The layoff monitor compares affected workers, sector stability, company-level WARN activity, and monthly trends.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree-architecture.webp",
        "alt": "The Last Degree end-to-end platform architecture",
        "caption": "College Scorecard, WARN, BLS, and Adzuna flow through Airflow and staging tables into an analytical mart consumed by Superset, the web app, and the AI agent.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree-dbt-dag.webp",
        "alt": "Airflow DAG for the dbt transformation workflow",
        "caption": "The dbt workflow runs dependency checks, staging models, the final mart, snapshots, tests, and documentation generation.",
        "kind": "landscape"
      },
      {
        "src": "assets/images/last-degree-lineage.webp",
        "alt": "Snowflake and dbt lineage for The Last Degree",
        "caption": "Raw source tables and lookup tables feed domain staging models before converging in the final degree ROI and industry outlook mart.",
        "kind": "landscape"
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
