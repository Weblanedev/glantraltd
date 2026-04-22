import React from 'react';
import { Metadata } from 'next';
import Wrapper from '@/layout/wrapper';
// import HeaderTwo from '@/layout/header/header-two';
import BreadcrumbOne from '@/components/breadcrumb/breadcrumb-one';
import ContactArea from '@/components/contact/contact-area';
import FooterThree from '@/layout/footer/footer-three';
import shape from '@/assets/images/shape/shape_33.svg';
// import NewsletterBanner from '@/components/newsletter/newsletter-banner';
import HeaderThree from '@/layout/header/header-three';

export const metadata: Metadata = {
  title: 'Contact Page - Glantra Store',
  description: 'Contact us for inquiries and support. We are here to help you with your global computing needs.',
  keywords: 'contact, support, inquiries, global computing, technology',
  authors: [{ name: 'Glantra Store' }],
  openGraph: {
    title: 'Glantra Store - Contact Us',
    description: 'Contact us for inquiries and support. We are here to help you with your global computing needs.',
    url: 'https://glantrastore.com',
    siteName: 'Glantra Store',
    images: [{ url: '/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glantra Store - Contact Us',
    description: 'Contact us for inquiries and support. We are here to help you with your global computing needs.',
  },
};

const ContactPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <HeaderThree />
        {/* header end */}
        <main>
          {/* breadcrumb start */}
          <BreadcrumbOne
            title="Contact us for inquiries"
            subtitle="Get our all info and also can message us directly from here"
            page="Contact"
            shape={shape}
          />
          {/* breadcrumb end */}

          {/* contact area start */}
          <ContactArea />
          {/* contact area end */}

          {/* news letter start */}
          {/* <NewsletterBanner /> */}
          {/* news letter end */}
        </main>

        {/* footer start */}
        <FooterThree style_2={true} />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default ContactPage;
