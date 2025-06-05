import React from 'react'

export default function main() {
  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Open Agri Soil Testing</title>
  <link rel="stylesheet" href="style.css" />
  <header>
    <h1>Welcome to Open Agri Soil Testing</h1>
    <p>Your unified platform for soil testing services.</p>
  </header>
  <section>
    <button onclick="join('Farmer')">Join as Farmer</button>
    <button onclick="join('Buyer')">Join as Buyer</button>
  </section>
  <section id="signup-section" style={{ display: "none" }}>
    <h2>Sign Up</h2>
    <form id="signup-form" onsubmit="submitForm(event)">
      <label>
        Name: <input type="text" name="name" required="" />
      </label>
      <br />
      <label>
        Role: <input type="text" name="role" id="role" readOnly="" />
      </label>
      <br />
      <label>
        Phone Number: <input type="tel" name="phone" required="" />
      </label>
      <br />
      <label>
        District / State: <input type="text" name="location" required="" />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  </section>
  <section id="thankyou-section" style={{ display: "none" }}>
    <h2>Thank you for signing up!</h2>
  </section>
</>
  )
}
