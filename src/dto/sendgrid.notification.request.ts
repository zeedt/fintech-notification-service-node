export interface SendGridNotificationRequest {
    from :EmailDetails,
    to : EmailDetails,
    subject : string,
    content : Content[],
    personalizations: Personalization[]

}

export interface EmailDetails {
    email : string,
    name : string,
}
export interface Content {
    type : string,
    value : string
}
export interface Personalization {
    to : EmailDetails[]
}