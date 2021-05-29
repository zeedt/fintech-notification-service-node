export interface InfobipSMSRequest {
    messages : MessageItem[]
}

export interface MessageItem {
    from : string,
    destinations : DestinationItem[],
    text : string
}

export interface DestinationItem {
    to : string
}