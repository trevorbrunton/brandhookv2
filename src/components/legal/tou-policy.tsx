import Markdown from "react-markdown";
const tou = ` 
### Introduction 
 
These BrandHook Discover Terms of Use (Terms) set out the terms and conditions on which BrandHook (Kristols Investment Pty Ltd ABN: 82 324 803 594) (“BrandHook,” “us,” “we,” “our”) provides access to and use of its platform through the website, the BrandHook Discover application, and its sub-domains (the Platform). 
 
Access and use of the Platform is conditional on you agreeing to be bound by these Terms, found at https://brandhook.com/terms-of-use and the BrandHook Privacy Policy found at 
https://brandhook.com/privacy If you do not agree to these Terms or the Privacy Policy, you are unable to access and use the Platform. 
 
BrandHook may update or change these Terms at any time and will try to give you 30 days’ notice prior to the updated or new terms taking effect. 


### Definitions

User means any business builder, startup founder, or individual using BrandHook Discover to facilitate customer discovery through the Platform. 
 

 
### Account Registration & Access to the Platform
 
 
#### 1.  You must be over the age of 18 to register an account or use the Platform. By agreeing to these Terms, you warrant that you are over the age of 18. 
 
#### 2.  If you are accessing and using the Platform on behalf of someone else, you represent that you have the authority to bind that person as principal to these Terms. 
 
####  3. Active Users are required to register for a BrandHook Discover account (Account). You may provide personal information when creating an Account. See our Privacy Policy for more information. 
 
#### 4.  Active Users must provide accurate, complete, and up-to-date information and safeguard the confidentiality of their Account, including username and password. 
 
#### 5.  BrandHook retains the right to decline an Active User or cancel an Account at any time. 
 
#### 6.  By uploading information to your Account, you are granting BrandHook a royalty-free, perpetual, non-exclusive worldwide license to use, copy, and display the information on our Platform for the purpose of providing the customer discovery process. 
 
 
### Products & Payment Terms
 
 
#### 1. BrandHook Discover facilitates customer discovery through the following features: 
#### - 	Generating Conversation Guides based on business ideas and hypotheses
#### - 	Delivering findings from conversation transcripts, Wow Moments, and Hypotheses
#### - 	And will help record and build transcripts over time.
 
#### 2.	Product fees may vary based on the selected Product Features. A free 30-day trial is offered to all Active Users, and a subscription payment model is activated on Day 31. 
 
#### 3.	You agree that BrandHook may change the Product Fee by notice to you at any time. 
 
### Accessibility & Inaccuracies
 
#### 1.	The Platform is provided on an ‘as is’ and ‘as available’ basis. BrandHook may undertake maintenance from time to time, and functionality may be unavailable during this time. 
 
#### 2.	BrandHook does not guarantee the accuracy or completeness of any information on the Platform. 

 
### Intellectual Property
 
You agree that all content, designs, features, and trademarks displayed on the Platform are the intellectual property of BrandHook (Kristols Investment Pty Ltd ABN: 82 324 803 594) or property that we have the right to use. You may not use BrandHook’s intellectual property except to access the Platform in accordance with these Terms.
 
### Termination
 
#### 1.	If BrandHook suspects that you are in breach of these Terms, it may cancel or suspend your Account immediately. 
 
#### 2.	If you want to cancel your Account, you can do so at any time by contacting BrandHook. 

 
### Limitation of Liability
 
#### 1.	To the maximum extent permitted by law, you agree that BrandHook is not responsible for any injury, harm, loss, or damage arising from the use or access of the Platform. 
 
#### 2.	The Platform may contain links to third-party websites. BrandHook does not control or endorse third-party websites and is not responsible for your access to these websites. 

 
### Indemnity
 
You agree to indemnify BrandHook against any liabilities, costs, claims, or damages arising from your breach of these Terms or your use of the Platform. 
 
### Jurisdiction
 
These Terms are governed by the laws of Victoria, Australia.

 
### Contact BrandHook 
 
If you have any questions about these Terms, please contact us by email at us@brandhook.com 

 
`;

export function TOUPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 prose-sm">
      <Markdown>{tou}</Markdown>
    </div>
  );
}