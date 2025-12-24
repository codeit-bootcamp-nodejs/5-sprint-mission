export class GetUnreadCountResDto {
  public message;
  
  constructor(public count: number) {
    this.message = `안 읽은 알림 개수는 ${count}입니다.`
  }
}
