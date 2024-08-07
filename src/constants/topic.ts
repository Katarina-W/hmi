export enum ALL_TOPICS {
  BLOB_TOPIC = "blob_topic",
  BOUNDARY_POINTA = "boundary_pointA",
  CAN_INFO = "can_info",
  CANOUT = "CANOut",
  CARINFOLIGHT = "carInfoLight",
  CAR_POSE = "car_pose",
  CAR_TRAJECTORY = "car_trajectory",
  CENTER_CAMERA_FOV120_MARKS = "center_camera_fov120_marks",
  CENTER_CAMERA_FOV120_ROAD = "center_camera_fov120_road",
  CENTER_CAMERA_FOV30 = "center_camera_fov30",
  CENTER_CAMERA_FOV30_MARKS = "center_camera_fov30_marks",
  CENTER_CAMERA_FOV30_ROAD = "center_camera_fov30_road",
  CHART_CAN_IN = "chart_can_in",
  CHART_CAN_OUT = "chart_can_out",
  CONN_LIST = "conn_list",
  DECISION_DEBUG_INFO = "decision_debug_info",
  DECISION_DEBUG_INFO_TEXT = "decision_debug_info_text",
  DECISION_TARGET = "decision_target",
  DECISION_TARGET_TEXT = "decision_target_text",
  DECISION_TGTREFLINE = "decision_tgtrefline",
  DR_INFO = "dr_info",
  DR_TRAJECTORY = "dr_trajectory",
  DPC_CONTROL_DEBUG = "dpc_control_debug",
  DPC_LFP_PLANNING_PLANLINE = "dpc_lfp_planning_planline",
  DPC_LFP_PLANNING_TRAJECTORY = "dpc_lfp_planning_trajectory",
  DPC_PLANNING_DEBUG_INFO = "dpc_planning_debug_info",
  DPC_PLANNING_EDGELINE = "dpc_planning_edgeline",
  DPC_PLANNING_OTHERLINE = "dpc_planning_otherline",
  DPC_PLANNING_REFERENCE_LINE = "dpc_planning_reference_line",
  DPC_PLANNING_TAG = "dpc_planning_tag",
  FRONTEND_FPS = "frontend_fps",
  FUSION_GOP = "fusion_gop",
  FUSIONLINES_MSG_FUSION_LINES = "fusionlines_msg fusion lines",
  FUSION_OBSTACLE_OBJECT = "fusion_obstacle_object",
  GLOBAL_TRAJECTORY = "global_trajectory",
  GNSS_INFO = "gnss_info",
  HDMAP_FREE_SPACE = "hdmap Free Space",
  HDMAP_LANE_LINES = "hdmap Lane Lines",
  HDMAP_TEXT_SPRITE = "hdmap Text Sprite",
  IMU_INFO = "imu_info",
  INS_INFO = "ins_info",
  LEFT_FRONT_CAMERA_MARKS = "left_front_camera_marks",
  LEFT_REAR_CAMERA_MARKS = "left_rear_camera_marks",
  LIDAR_FOV_ZONES = "lidar_fov_zones",
  LOCALIZATION_GLOBAL_HISTORY_TRAJECTORY = "localization_global_history_trajectory",
  LOCALIZATION_INFO = "localization_info",
  LOCALIZATION_LOCAL_HISTORY_TRAJECTORY = "localization_local_history_trajectory",
  LOCALIZATION_POSITION = "localization_position",
  LOCALMAP_CENTER_LINE = "localmap_center_line",
  LOCALMAP_CROSSWALK = "localmap_crosswalk",
  LOCALMAP_INFO = "localmap_info",
  LOCALMAP_JUNCTION = "localmap_junction",
  LOCALMAP_LANE_LANE = "localmap_lane_lane",
  LOCALMAP_LANE_LINE = "localmap_lane_line",
  LOCALMAP_LANE_SIGN_GROUP = "localmap_lane_sign_group",
  LOCALMAP_MAP_LANE_ID = "localmap_map_lane_id",
  LOCALMAP_MAP_LINE_ID = "localmap_map_line_id",
  LOCALMAP_MSG_CENTER_LINES_CENTER_LINES = "localmap_msg Center Lines Center Lines",
  LOCALMAP_MSG_LANE_DEMARCATION_LINES = "localmap_msg Lane Demarcation Lines",
  LOCALMAP_MSG_LANE_LINES = "localmap_msg Lane Lines",
  LOCALMAP_MSG_LANE_LINK = "localmap_msg lane link",
  LOCALMAP_OTHER_TRAFFIC_LIGHT = "localmap_other_traffic_light",
  LOCALMAP_OTHER_TRAFFIC_SIGN = "localmap_other_traffic_sign",
  LOCALMAP_POLE = "localmap_pole",
  LOCALMAP_ROAD_MARKER = "localmap_road_marker",
  LOCALMAP_SPEEDBUMP = "localmap_speedbump",
  LOCALMAP_STOP_LINE = "localmap_stop_line",
  LOCALMAP_TRAFFIC_LIGHT = "localmap_traffic_light",
  LOCALMAP_TRAFFIC_LIGHT_GROUP = "localmap_traffic_light_group",
  LOCALMAP_TRAFFIC_SIGN = "localmap_traffic_sign",
  LOCALMAP_TRAFFIC_SIGN_GROUP = "localmap_traffic_sign_group",
  MAP_INFO = "Map Info",
  MAP_TRAFFIC_LIGHT1 = "map_traffic_light1",
  MEMDRIVE_REF_ROUTE_TRAJECTORY = "memdrive_ref_route_trajectory",
  MEMDRIVE_REF_TRAJECTORY = "memdrive_ref_trajectory",
  MONITOR_INFO = "monitor_info",
  MONITOR_REPORT = "monitor_report",
  NAVIGATION_INFO = "Navigation_info",
  NNP_STATE = "NNP_state",
  NNPSTATE2MCU = "NNPState2MCU",
  NNP_STATE_ICON = "nnp_state_icon",
  OBJ_CENTER_CAMERA_FOV120 = "Obj_center_camera_fov120",
  OBJ_CENTER_CAMERA_FOV30 = "Obj_center_camera_fov30",
  OBJ_LEFT_FRONT_CAMERA = "Obj_left_front_camera",
  OBJ_LEFT_REAR_CAMERA = "Obj_left_rear_camera",
  OBJ_REAR_CAMERA = "Obj_rear_camera",
  OBSTACLE_TOPIC = "Obstacle_topic",
  ODOMETRY_INFO = "odometry_info",
  PERCEPTION_CAMERA_FRONT = "perception_camera_front",
  PERCEPTION_CAMERA_FRONT_PERCEPTION_CAMERA_CAR_LIGHT = "perception_camera_front perception_camera_car_light",
  PERCEPTION_CAMERA_NV = "perception_camera_nv",
  PERCEPTION_CAMERA_NV_PERCEPTION_CAMERA_CAR_LIGHT = "perception_camera_nv perception_camera_car_light",
  PERCEPTION_CAMERA_ROADLINES_CENTER_CAMERA_FOV120 = "perception_camera_roadlines center_camera_fov120",
  PERCEPTION_CAMERA_ROADLINES_CENTER_CAMERA_FOV30 = "perception_camera_roadlines center_camera_fov30",
  PERCEPTION_CAMERA_ROADLINES_NV_CAMERAS = "perception_camera_roadlines nv_cameras",
  PERCEPTION_FUSION_OBJECT = "perception_fusion_object",
  "/PERCEPTION/FUSION/OBJECT" = "/perception/fusion/object",
  "/PERCEPTION/FRONT_RADAR/OBJECT" = "/perception/front_radar/object",
  PERCEPTION_FUSION_PERCEPTION_FUSION_CAR_LIGHT = "perception_fusion perception_fusion_car_light",
  PERCEPTION_FUSION_PERCEPTION_FUSION_OBJECT = "perception_fusion /perception/fusion/object",
  PERCEPTION_LIDAR_OBJECT = "perception_lidar_object",
  PERCEPTION_OBSTACLE_FUSION = "perception_obstacle_fusion",
  PERCEPTION_RADAR_FRONT = "perception_radar_front",
  PILOT_STATE = "Pilot_state",
  PILOT_STATE_ICON = "pilot_state_icon",
  PILOTHMI_CROSS_WALK_LOCAL = "pilothmi_cross_walk_local",
  PILOTHMI_DRIVE_INFO = "pilothmi_drive_info",
  PILOTHMI_ENVM_INFO = "pilothmi_envm_info",
  PILOTHMI_IMAGE_OVERLAY = "pilothmi_image_overlay",
  PILOTHMI_LANE_LINE = "pilothmi_lane_line",
  PILOTHMI_LANE_LINES = "pilothmi_lane_lines",
  PILOTHMI_PERCEPTION_ENVODD = "pilothmi_perception_envodd",
  PILOTHMI_PERCEPTION_OBSTACLE_FUSION_OBJECT = "pilothmi_perception_obstacle_fusion object",
  PILOTHMI_PERCEPTION_OBSTACLE_LOCAL = "pilothmi_perception_obstacle_local",
  PILOTHMI_PERCEPTION_TRAFFIC_PARTICIPANT_FUSION_OBJECT = "pilothmi_perception_traffic_participant_fusion object",
  PILOTHMI_PILOT_PLANNING_TRAJECTORY = "pilothmi_pilot_planning_trajectory",
  PILOTHMI_PLANNING_LINES_INFO = "pilothmi_planning_lines_info",
  PILOTHMI_STOP_LINE = "pilothmi_stop_line",
  PILOTHMI_VEHICLE_REPORT = "pilothmi_vehicle_report",
  PLANNING_INFO = "planning_info",
  PLANNING_INFO_POLYLINE = "planning_info_polyline",
  PLANNING_LATERAL_DEBUG = "planning_lateral_debug",
  PLANNING_TEXTBOX = "planning_textbox",
  PLANNING_TRAJECTORY = "planning_trajectory",
  POLYGONCOLORCONTROL = "polygonColorControl",
  POSE_STD = "pose_std",
  PREDICTION_OBJECT = "prediction_object",
  PREDICTION_OBJ_LOG = "prediction_obj_log",
  REAR_CAMERA = "rear_camera",
  REAR_CAMERA_MARKS = "rear_camera_marks",
  RIGHT_FRONT_CAMERA_MARKS = "right_front_camera_marks",
  RIGHT_REAR_CAMERA_MARKS = "right_rear_camera_marks",
  SCENARIO_MODEL = "scenario_model",
  SCENARIO_MODEL_DEBUG = "scenario_model_debug",
  SCENARIO_PARKED_VEHICLE = "scenario_parked_vehicle",
  SDMAP_ENDLINK_NODE = "sdmap_endlink_node",
  SDMAP_GEOMETRY_LINE = "sdmap_geometry_line",
  SDMAP_NAV_LINE = "sdmap_nav_line",
  SDMAP_STARTLINK_NODE = "sdmap_startlink_node",
  SENSOR_CAN_FRAME_SEQUENCE_CHART = "sensor_can_frame_sequence_chart",
  SENSOR_CAN_TIMESTAMP_CHART = "sensor_can_timestamp_chart",
  SENSOR_CAN_VEHICLE_MAP_CHART = "sensor_can_vehicle_map_chart",
  SENSOR_CAN_WHEEL_SPEED_CHART = "sensor_can_wheel_speed_chart",
  SENSOR_IMU_ACCEL_CHART = "sensor_imu_accel_chart",
  SENSOR_IMU_FRAME_SEQUENCE_CHART = "sensor_imu_frame_sequence_chart",
  SENSOR_IMU_GYRO_CHART = "sensor_imu_gyro_chart",
  SENSOR_IMU_TIMESTAMP_CHART = "sensor_imu_timestamp_chart",
  SENSOR_INS_INFO = "sensor_ins_info",
  SENSOR_VEHICLE_INFO = "sensor_vehicle_info",
  SENSOR_VEHICLE_STAT = "sensor_vehicle_stat",
  STATEMACHINE2MCU = "StateMachine2MCU",
  STATEMACHINE2SOC = "StateMachine2SOC",
  TRAFFICLIGHT = "trafficLight",
  TRAFFIC_LIGHT_GROUP = "traffic_light_group",
  TRAFFIC_LIGHT_TURNTYPE = "traffic_light_turntype",
  TRAFFICSIGNAL = "trafficSignal",
  TOPIC_INFO = "topicInfo",
  VEHICLE_ALARM_INFO = "VehicleAlarmInfo",
  VEHICLE_INFO = "Vehicle Info",
  VEHICLE_REPORT_STAT = "vehicle_report_stat",
  VISUALIZER_SERVER_FPS = "visualizer_server_fps"
}

export const VIRTUAL_RENDER_MAP = {
  arrow: [
    ALL_TOPICS.CAR_TRAJECTORY,
    ALL_TOPICS.DR_TRAJECTORY,
    ALL_TOPICS.FUSION_GOP,
    ALL_TOPICS.FUSION_OBSTACLE_OBJECT,
    ALL_TOPICS.GLOBAL_TRAJECTORY,
    ALL_TOPICS.LOCALMAP_MSG_LANE_LINK,
    ALL_TOPICS.LOCALIZATION_GLOBAL_HISTORY_TRAJECTORY,
    ALL_TOPICS.LOCALIZATION_LOCAL_HISTORY_TRAJECTORY,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV120,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV30,
    ALL_TOPICS.OBJ_LEFT_FRONT_CAMERA,
    ALL_TOPICS.OBJ_LEFT_REAR_CAMERA,
    ALL_TOPICS.OBJ_REAR_CAMERA,
    ALL_TOPICS.PERCEPTION_CAMERA_FRONT,
    ALL_TOPICS.PERCEPTION_CAMERA_NV,
    ALL_TOPICS.PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_FUSION_PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_LIDAR_OBJECT,
    ALL_TOPICS.PREDICTION_OBJECT,
    ALL_TOPICS.PERCEPTION_OBSTACLE_FUSION,
    ALL_TOPICS.PERCEPTION_RADAR_FRONT
  ],
  crosswalk: [ALL_TOPICS.LOCALMAP_CROSSWALK],
  cylinder: [ALL_TOPICS.MAP_TRAFFIC_LIGHT1],
  ellipse: [
    ALL_TOPICS.BOUNDARY_POINTA,
    ALL_TOPICS.LOCALIZATION_POSITION,
    ALL_TOPICS.POSE_STD,
    ALL_TOPICS.SDMAP_ENDLINK_NODE,
    ALL_TOPICS.SDMAP_STARTLINK_NODE
  ],
  fixedPolygon: [
    ALL_TOPICS.CARINFOLIGHT,
    ALL_TOPICS.PERCEPTION_CAMERA_FRONT_PERCEPTION_CAMERA_CAR_LIGHT,
    ALL_TOPICS.PERCEPTION_CAMERA_NV_PERCEPTION_CAMERA_CAR_LIGHT,
    ALL_TOPICS.PERCEPTION_FUSION_PERCEPTION_FUSION_CAR_LIGHT
  ],
  freespace: [
    ALL_TOPICS.HDMAP_FREE_SPACE,
    ALL_TOPICS.LOCALMAP_JUNCTION,
    ALL_TOPICS.LOCALMAP_LANE_LANE,
    ALL_TOPICS.TRAFFIC_LIGHT_TURNTYPE
  ],
  poleModel: [ALL_TOPICS.LOCALMAP_POLE],
  polygon: [
    ALL_TOPICS.FUSION_GOP,
    ALL_TOPICS.FUSION_OBSTACLE_OBJECT,
    ALL_TOPICS.LIDAR_FOV_ZONES,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV120,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV30,
    ALL_TOPICS.OBJ_LEFT_FRONT_CAMERA,
    ALL_TOPICS.OBJ_LEFT_REAR_CAMERA,
    ALL_TOPICS.OBJ_REAR_CAMERA,
    ALL_TOPICS.PERCEPTION_CAMERA_FRONT,
    ALL_TOPICS.PERCEPTION_CAMERA_NV,
    ALL_TOPICS.PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_FUSION_PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_LIDAR_OBJECT,
    ALL_TOPICS.PREDICTION_OBJECT,
    ALL_TOPICS.PERCEPTION_OBSTACLE_FUSION
  ],
  polyline: [
    ALL_TOPICS.CENTER_CAMERA_FOV120_ROAD,
    ALL_TOPICS.CENTER_CAMERA_FOV30_ROAD,
    ALL_TOPICS.DECISION_DEBUG_INFO,
    ALL_TOPICS.DECISION_TGTREFLINE,
    ALL_TOPICS.DPC_LFP_PLANNING_PLANLINE,
    ALL_TOPICS.DPC_LFP_PLANNING_TRAJECTORY,
    ALL_TOPICS.DPC_PLANNING_DEBUG_INFO,
    ALL_TOPICS.DPC_PLANNING_EDGELINE,
    ALL_TOPICS.DPC_PLANNING_OTHERLINE,
    ALL_TOPICS.DPC_PLANNING_REFERENCE_LINE,
    ALL_TOPICS.FUSIONLINES_MSG_FUSION_LINES,
    ALL_TOPICS.HDMAP_LANE_LINES,
    ALL_TOPICS.LOCALMAP_CENTER_LINE,
    ALL_TOPICS.LOCALMAP_LANE_LINE,
    ALL_TOPICS.LOCALMAP_MSG_CENTER_LINES_CENTER_LINES,
    ALL_TOPICS.LOCALMAP_MSG_LANE_DEMARCATION_LINES,
    ALL_TOPICS.LOCALMAP_MSG_LANE_LINES,
    ALL_TOPICS.LOCALMAP_SPEEDBUMP,
    ALL_TOPICS.LOCALMAP_STOP_LINE,
    ALL_TOPICS.MEMDRIVE_REF_ROUTE_TRAJECTORY,
    ALL_TOPICS.MEMDRIVE_REF_TRAJECTORY,
    ALL_TOPICS.PERCEPTION_CAMERA_ROADLINES_CENTER_CAMERA_FOV120,
    ALL_TOPICS.PERCEPTION_CAMERA_ROADLINES_CENTER_CAMERA_FOV30,
    ALL_TOPICS.PERCEPTION_CAMERA_ROADLINES_NV_CAMERAS,
    ALL_TOPICS.PREDICTION_OBJECT,
    ALL_TOPICS.PREDICTION_OBJ_LOG,
    ALL_TOPICS.PLANNING_INFO,
    ALL_TOPICS.PLANNING_INFO_POLYLINE,
    ALL_TOPICS.PLANNING_LATERAL_DEBUG,
    ALL_TOPICS.PLANNING_TRAJECTORY,
    ALL_TOPICS.SCENARIO_MODEL,
    ALL_TOPICS.SCENARIO_MODEL_DEBUG,
    ALL_TOPICS.SDMAP_GEOMETRY_LINE,
    ALL_TOPICS.SDMAP_NAV_LINE
  ],
  roadMarkerModel: [ALL_TOPICS.LOCALMAP_ROAD_MARKER],
  sphere: [ALL_TOPICS.SCENARIO_PARKED_VEHICLE],
  target: [
    ALL_TOPICS.DECISION_DEBUG_INFO,
    ALL_TOPICS.DPC_PLANNING_DEBUG_INFO,
    ALL_TOPICS.FUSION_GOP,
    ALL_TOPICS.FUSION_OBSTACLE_OBJECT,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV120,
    ALL_TOPICS.OBJ_CENTER_CAMERA_FOV30,
    ALL_TOPICS.OBJ_LEFT_FRONT_CAMERA,
    ALL_TOPICS.OBJ_LEFT_REAR_CAMERA,
    ALL_TOPICS.OBJ_REAR_CAMERA,
    ALL_TOPICS.PERCEPTION_CAMERA_FRONT,
    ALL_TOPICS.PERCEPTION_CAMERA_NV,
    ALL_TOPICS.PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_FUSION_PERCEPTION_FUSION_OBJECT,
    ALL_TOPICS.PERCEPTION_LIDAR_OBJECT,
    ALL_TOPICS.PERCEPTION_OBSTACLE_FUSION,
    ALL_TOPICS.PERCEPTION_RADAR_FRONT,
    ALL_TOPICS.PLANNING_INFO,
    ALL_TOPICS.SCENARIO_MODEL,
    ALL_TOPICS.SCENARIO_MODEL_DEBUG
  ],
  text_sprite: [
    ALL_TOPICS.HDMAP_TEXT_SPRITE,
    ALL_TOPICS.LOCALMAP_MAP_LANE_ID,
    ALL_TOPICS.LOCALMAP_MAP_LINE_ID
  ],
  trafficLightModel: [
    ALL_TOPICS.LOCALMAP_OTHER_TRAFFIC_LIGHT,
    ALL_TOPICS.LOCALMAP_TRAFFIC_LIGHT,
    ALL_TOPICS.TRAFFICLIGHT
  ],
  trafficSignalModel: [
    ALL_TOPICS.LOCALMAP_OTHER_TRAFFIC_SIGN,
    ALL_TOPICS.LOCALMAP_TRAFFIC_SIGN,
    ALL_TOPICS.TRAFFICSIGNAL
  ]
} as const;

export const AUGMENTED_RENDER_MAP = {
  crosswalk: [ALL_TOPICS.PILOTHMI_CROSS_WALK_LOCAL],
  freespace: [ALL_TOPICS.HDMAP_FREE_SPACE, ALL_TOPICS.PILOTHMI_LANE_LINE],
  obstacleModel: [
    ALL_TOPICS.PILOTHMI_PERCEPTION_OBSTACLE_FUSION_OBJECT,
    ALL_TOPICS.PILOTHMI_PERCEPTION_OBSTACLE_LOCAL,
    ALL_TOPICS.OBSTACLE_TOPIC
  ],
  participantModel: [
    ALL_TOPICS.PILOTHMI_PERCEPTION_TRAFFIC_PARTICIPANT_FUSION_OBJECT
  ],
  polyline: [
    ALL_TOPICS.PILOTHMI_LANE_LINES,
    ALL_TOPICS.PILOTHMI_PLANNING_LINES_INFO,
    ALL_TOPICS.PILOTHMI_PILOT_PLANNING_TRAJECTORY,
    ALL_TOPICS.PILOTHMI_STOP_LINE
  ],
  poleModel: [ALL_TOPICS.LOCALMAP_POLE],
  roadMarkerModel: [ALL_TOPICS.LOCALMAP_ROAD_MARKER],
  trafficLightModel: [
    ALL_TOPICS.LOCALMAP_OTHER_TRAFFIC_LIGHT,
    ALL_TOPICS.LOCALMAP_TRAFFIC_LIGHT
  ],
  trafficSignalModel: [
    ALL_TOPICS.LOCALMAP_OTHER_TRAFFIC_SIGN,
    ALL_TOPICS.LOCALMAP_TRAFFIC_SIGN
  ]
} as const;

export const OTHER_INFO_MAP = {
  LaneSignGroup: [ALL_TOPICS.LOCALMAP_LANE_SIGN_GROUP],
  TrafficLightGroup: [ALL_TOPICS.LOCALMAP_TRAFFIC_LIGHT_GROUP],
  TrafficSignGroup: [ALL_TOPICS.LOCALMAP_TRAFFIC_SIGN_GROUP],
  car_pose: [ALL_TOPICS.CAR_POSE],
  chart: [
    ALL_TOPICS.CHART_CAN_IN,
    ALL_TOPICS.CHART_CAN_OUT,
    ALL_TOPICS.SENSOR_CAN_FRAME_SEQUENCE_CHART,
    ALL_TOPICS.SENSOR_CAN_TIMESTAMP_CHART,
    ALL_TOPICS.SENSOR_CAN_VEHICLE_MAP_CHART,
    ALL_TOPICS.SENSOR_CAN_WHEEL_SPEED_CHART,
    ALL_TOPICS.SENSOR_IMU_ACCEL_CHART,
    ALL_TOPICS.SENSOR_IMU_FRAME_SEQUENCE_CHART,
    ALL_TOPICS.SENSOR_IMU_GYRO_CHART,
    ALL_TOPICS.SENSOR_IMU_TIMESTAMP_CHART
  ],
  conn_list: [ALL_TOPICS.CONN_LIST],
  data: [ALL_TOPICS.VISUALIZER_SERVER_FPS],
  image: [
    ALL_TOPICS.CENTER_CAMERA_FOV120_MARKS,
    ALL_TOPICS.CENTER_CAMERA_FOV30,
    ALL_TOPICS.CENTER_CAMERA_FOV30_MARKS,
    ALL_TOPICS.LEFT_FRONT_CAMERA_MARKS,
    ALL_TOPICS.LEFT_REAR_CAMERA_MARKS,
    ALL_TOPICS.REAR_CAMERA,
    ALL_TOPICS.REAR_CAMERA_MARKS,
    ALL_TOPICS.RIGHT_FRONT_CAMERA_MARKS,
    ALL_TOPICS.RIGHT_REAR_CAMERA_MARKS
  ],
  monitor_info: [ALL_TOPICS.MONITOR_INFO],
  monitorData: [ALL_TOPICS.MONITOR_REPORT],
  pilotDrive: [ALL_TOPICS.PILOTHMI_DRIVE_INFO],
  pilot_image_overlay: [ALL_TOPICS.PILOTHMI_IMAGE_OVERLAY],
  ring: [ALL_TOPICS.BLOB_TOPIC],
  statusInfo: [
    ALL_TOPICS.PILOTHMI_ENVM_INFO,
    ALL_TOPICS.PILOTHMI_VEHICLE_REPORT,
    ALL_TOPICS.POLYGONCOLORCONTROL
  ],
  traffic_light_group: [ALL_TOPICS.TRAFFIC_LIGHT_GROUP],
  text: [
    ALL_TOPICS.CAN_INFO,
    ALL_TOPICS.CANOUT,
    ALL_TOPICS.DECISION_DEBUG_INFO_TEXT,
    ALL_TOPICS.DECISION_TARGET,
    ALL_TOPICS.DECISION_TARGET_TEXT,
    ALL_TOPICS.DR_INFO,
    ALL_TOPICS.DPC_CONTROL_DEBUG,
    ALL_TOPICS.DPC_PLANNING_TAG,
    ALL_TOPICS.GNSS_INFO,
    ALL_TOPICS.IMU_INFO,
    ALL_TOPICS.INS_INFO,
    ALL_TOPICS.LOCALIZATION_INFO,
    ALL_TOPICS.LOCALMAP_INFO,
    ALL_TOPICS.MAP_INFO,
    ALL_TOPICS.NAVIGATION_INFO,
    ALL_TOPICS.NNP_STATE,
    ALL_TOPICS.NNPSTATE2MCU,
    ALL_TOPICS.ODOMETRY_INFO,
    ALL_TOPICS.PLANNING_TEXTBOX,
    ALL_TOPICS.PILOT_STATE,
    ALL_TOPICS.SENSOR_INS_INFO,
    ALL_TOPICS.STATEMACHINE2MCU,
    ALL_TOPICS.STATEMACHINE2SOC
  ],
  topicInfo: [
    ALL_TOPICS["/PERCEPTION/FUSION/OBJECT"],
    ALL_TOPICS["/PERCEPTION/FRONT_RADAR/OBJECT"]
  ],
  unknown: [ALL_TOPICS.FRONTEND_FPS],
  vehicleAlarmInfo: [ALL_TOPICS.VEHICLE_ALARM_INFO],
  vehicle_info: [ALL_TOPICS.SENSOR_VEHICLE_INFO, ALL_TOPICS.VEHICLE_INFO],
  vehicle_stat: [
    ALL_TOPICS.NNP_STATE_ICON,
    ALL_TOPICS.PILOT_STATE_ICON,
    ALL_TOPICS.SENSOR_VEHICLE_STAT,
    ALL_TOPICS.VEHICLE_REPORT_STAT
  ],
  Weather: [ALL_TOPICS.PILOTHMI_PERCEPTION_ENVODD]
} as const;
