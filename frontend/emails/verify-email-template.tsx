import React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Column,
} from "@react-email/components"

interface VerifyEmailTemplateProps {
  firstName: string
  lastName: string
  code: string
  baseUrl: string
}

export default function VerifyEmailTemplate({
  firstName = "John",
  lastName = "Doe",
  code = "123456",
  baseUrl = "https://example.com",
}: VerifyEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address with code {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="150"
              height="50"
              alt="Company Logo"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Verify Your Email Address</Heading>
            <Text style={greeting}>
              Hello {firstName} {lastName},
            </Text>
            <Text style={paragraph}>
              Thank you for signing up! Please use the verification code below
              to complete your registration. This code will expire in 10
              minutes.
            </Text>
            {/* Copy Button */}
            <Section style={buttonContainer}>
              <Button
                style={copyButton}
                href={`${baseUrl}/verify?code=${code}`}
              >
                Verify Email
              </Button>
            </Section>
            <Hr />
            <Text style={paragraph}>Or you can manually enter this code:</Text>
            {/* Code Display Section */}
            <Section style={codeContainer}>
              <Text style={codeDigitsRow}>{code}</Text>
            </Section>
            <Hr style={divider} />
            <Text style={footerText}>
              If you didn't request this email, you can safely ignore it.
            </Text>
            <Text style={footerText}>
              Need help?{" "}
              <Link href={`${baseUrl}/support`} style={link}>
                Contact Support
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerCopyright}>
              © 2025 Your Company Name. All rights reserved.
            </Text>
            <Row>
              <Column align="center">
                <Link href={`${baseUrl}/privacy`} style={footerLink}>
                  Privacy Policy
                </Link>
                <Text style={footerLinkSeparator}>•</Text>
                <Link href={`${baseUrl}/terms`} style={footerLink}>
                  Terms of Service
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  maxWidth: "600px",
  width: "100%",
  padding: "1rem",
  marginTop: "1rem",
  marginBottom: "4rem",
  marginInline: "auto",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
}

const logoContainer = {
  padding: "32px 20px",
  textAlign: "center" as const,
}

const logo = {
  margin: "0 auto",
}

const contentSection = {
  maxWidth: "480px",
}

const heading = {
  fontSize: "1.75rem",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "0 0 3rem",
  textAlign: "center" as const,
}

const greeting = {
  fontSize: "1.25rem",
  color: "#333333",
  margin: "0 0 1rem",
  fontWeight: "500",
}

const paragraph = {
  fontSize: "1rem",
  lineHeight: "1.625rem",
  color: "#666666",
  margin: "1rem 0",
}

const codeContainer = {
  textAlign: "center" as const,
}

const codeRow = {
  display: "inline-block",
  width: "100%",
  height: "2.5rem",
  margin: "0 0.25rem",
  backgroundColor: "#f4f4f5",
  borderRadius: "0.5rem",
  border: "0.125rem solid #e4e4e7",
  textAlign: "center" as const,
  verticalAlign: "middle",
}

const codeDigitsRow = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  margin: "0 auto",
  backgroundColor: "#f4f4f5",
  borderRadius: "0.5rem",
  border: "0.125rem solid #e4e4e7",
  textAlign: "center" as const,
  verticalAlign: "middle",
  fontSize: "1.375rem",
  fontWeight: "700",
  letterSpacing: "0.2em",
  color: "#1a1a1a",
  lineHeight: "1.625rem",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "1.5rem 0",
}

const copyButton = {
  backgroundColor: "#5046e5",
  borderRadius: "0.5rem",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "0.75rem 3rem",
  cursor: "pointer",
  border: "none",
}

const divider = {
  borderColor: "#e6e6e6",
  margin: "2rem 0",
}

const footerText = {
  fontSize: "0.875rem",
  color: "#999999",
  textAlign: "center" as const,
  margin: "0.5rem 0",
}

const link = {
  color: "#5046e5",
  textDecoration: "underline",
}

const footer = {
  padding: "2rem 1.25rem",
  textAlign: "center" as const,
}

const footerCopyright = {
  fontSize: "0.75rem",
  color: "#999999",
  margin: "0 0 0.75rem",
}

const footerLink = {
  fontSize: "0.75rem",
  color: "#666666",
  textDecoration: "none",
  marginRight: "0.5rem",
  marginLeft: "0.5rem",
}

const footerLinkSeparator = {
  display: "inline",
  color: "#999999",
  margin: "0 0.25rem",
}
