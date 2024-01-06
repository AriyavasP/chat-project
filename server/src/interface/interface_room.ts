export interface IRoom {
  user: [
    {
      id_user: string;
      connect_time: Date;
      role: string;
      disconnect_time: Date;
      status: boolean;
    }
  ];
  topic: string;
  created: string;
  create_time: Date;
  status_active: boolean;
  status: boolean;
}
