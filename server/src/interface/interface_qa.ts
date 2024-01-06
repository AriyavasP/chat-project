export interface IQadialog {
  option: [
    {
      id_question: string;
      number: number;
      message: string;
      status: boolean;
    }
  ];
  group: string;
  number: number;
  message: string;
  create_time: Date;
  status: boolean;
}
