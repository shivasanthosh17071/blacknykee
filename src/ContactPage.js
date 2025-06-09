import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const phoneNumber = "919182868227"; // WhatsApp format
    const text = `Name: ${name}%0AEmail: ${email}%0ASubject: ${subject}%0AMessage: ${message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <Container
      fluid
      className="py-5"
           
      style={{  background:" linear-gradient(90deg,rgba(195, 0, 255, 0.13) 25%,rgba(247, 0, 255, 0.07) 50%,rgba(8, 0, 255, 0.13) 75%)", minHeight: "100vh" }}
    >
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h2 className="fw-bold">Contact Us</h2>
          <p className="text-muted">We'd love to hear from you!</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit} style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 0 15px rgba(0,0,0,0.05)" }}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSubject" className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Your message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit"
              style={{background : "linear-gradient(45deg,rgb(252, 0, 0),rgb(90, 14, 14))",border:"none"}}>
                Send Message
              </Button>
            </div>
          </Form>
        </Col>

        <Col md={4} className="mt-4 mt-md-0">
          <div className="p-3 bg-white rounded shadow-sm" style={{ height: "100%" }}>
            <h5 className="fw-bold mb-3">Contact Information</h5>
            <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>123 Street, Chennai, India</p>
            <p className="mb-2"><i className="bi bi-telephone-fill me-2"></i>+91 91828 68227</p>
            <p className="mb-2"><i className="bi bi-envelope-fill me-2"></i>info@example.com</p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-dark">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-dark">
                <i className="bi bi-twitter fs-4"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-dark">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-dark">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;
