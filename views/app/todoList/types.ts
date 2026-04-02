export interface TaskList {
    dayFormatted: string;
    type: string;
    categoryTaskUuid: string;
    uuid: string;
    userUuid: string;
    tasksForTheDay: TasksForTheDay;
    enableShiftNextDay: boolean;
    shiftLimitStart: string;
    shiftLimitEnd: string;
    name?: string;
  }
  
  export interface TasksForTheDay {
    tasks: Task[];
    uuid: string;
    type: string;
    name: string;
  }
  
  export interface Task {
    updatedAt: Date;
    status: string;
    businessUuid: string;
    description: string;
    contractorUuid: string;
    name: string;
    uuid: string;
    createdBy: string;
    createdAt: Date;
    categoryUuid: string;
  }