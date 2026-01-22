import { Html, Body, Container, Text, Heading } from '@react-email/components';

type Props = {
    customerName: string
    ticketTitle: string
    newStatus: string
    supportEmail: string
}

export default function StatusUpdateEmail({ customerName, ticketTitle, newStatus, supportEmail }: Props) {
    return (
        <Html>
            <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f6f6f6', padding: '2rem' }}>
                <Container style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px' }}>
                    <Heading>Ticket Status Updated</Heading>
                    <Text>Hello {customerName},</Text>
                    <Text>
                        Your ticket "<strong>{ticketTitle}</strong>" has been updated to <strong>{newStatus}</strong>.
                    </Text>
                    <Text>If you have further questions, please reply to this email.</Text>
                    <Text>Best regards,<br />{supportEmail}</Text>
                </Container>
            </Body>
        </Html>
    )
}
