export class EventBus {
    private handlers = new Map<string, Function[]>();

    subscribe(eventName: string, handler: Function) {
        const list = this.handlers.get(eventName) ?? [];
        list.push(handler);
        this.handlers.set(eventName, list);
    }

    publish(event: object) {
        // (12) 이벤트 클래스 이름을 키로 가져옴
        const eventName = event.constructor.name;

        // (13) 해당 이름으로 등록된 모든 핸들러 조회
        const handlers = this.handlers.get(eventName) ?? [];

        // (14) 모든 핸들러를 순차 실행
        handlers.forEach((handler) => handler(event));
    }
}
