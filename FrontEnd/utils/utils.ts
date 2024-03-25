import { decode } from 'base-64'

export const getBodyTextFromRaw = (payload: any) => {
    if (payload.raw) {
        // If the payload has a body, return the body text
        return decode(payload.raw!.replaceAll(/-/g, '+').replaceAll(/_/g, '/'))
    } else if (payload.parts) {
        // If the payload has parts, recursively search for the body text
        for (const part of payload.parts) {
            const bodyText: any = getBodyText(part)
            if (bodyText) {
                return bodyText
            }
        }
    }
    return null
}

export const getBodyText = (parts: any) => {
    for (let part of parts) {
        // Check if the part has body data
        if (part.body && part.body.data) {
            // Decode the body data (assuming it's base64 encoded)
            const decodedBody = decode(
                part.body.data!.replaceAll(/-/g, '+').replaceAll(/_/g, '/')
            )

            // Return the decoded body
            return decodedBody
        }

        // If the part has nested parts, recursively search for the body
        if (part.parts) {
            const body: any = getBodyText(part.parts)
            if (body) {
                return body
            }
        }
    }

    // If no body is found, return null
    return null
}

export const getSubjectFromPayload = (payload: any) => {
    return (
        payload?.headers?.find((header: any) => header?.name == 'Subject')
            ?.value ?? ''
    )
}

export const getDateFromPayload = (payload: any) => {
    return new Date(
        payload?.headers?.find((header: any) => header?.name == 'Date')
            ?.value ?? 0
    )
}
