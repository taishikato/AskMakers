import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

const TermsPrivacy = () => {
  const router = useRouter()
  const title = 'Terms of Service & Privacy | AskMakers - Ask experienced makers questions'
  const url = `https://askmakers.co${router.asPath}`

  return (
  <>
  <Head>
    <title key="title">{title}</title>
    <meta
      key="og:title"
      property="og:title"
      content={title}
    />
    <meta key="og:site_name" property="og:site_name" content={title} />
    <meta key="og:url" property="og:url" content={url} />
    <link key="canonical" rel="canonical" href={url} />
  </Head>
  <Layout>
    <div id="terms-privacy" className="mt-10 mb-12 w-8/12 m-auto">
      <div className="columns">
        <div className="column bg-white pd-15rem radius-box">
          <div className="content">
            <h1 className="title mb-5">Terms and Conditions</h1>
            <p>
              These terms and conditions govern the access to and the use of
              AskMakers' services and platforms, through the website. All users
              must comply with the terms and conditions on this page to be able to
              use AskMakers and its services and platforms.
            </p>
            <p className="has-text-weight-bold is-size-5">Public Use</p>
            <p>
              All users should commit to ethics and values and should refrain from
              insult and abuse of the site.
            </p>

            <p className="has-text-weight-bold is-size-5">Privacy Policy</p>
            <p>
              You understand that through your use of the Services, you consent to
              the collection and use of your data and information, as set forth in
              the Privacy Policy. You need to read it before you use or access the
              Services.
            </p>

            <p className="has-text-weight-bold is-size-5">Denial of Access</p>
            <p>
              AskMaker has the right to block any user from accessing the website
              or using it's services in general.
            </p>

            <p className="has-text-weight-bold is-size-5">Impersonation</p>
            <p>
              Impersonation by name or subdomain is not allowed and AskMakers has
              the right to take adequate actions.
            </p>

            <p className="has-text-weight-bold is-size-5">Inactive Accounts</p>
            <p>
              AskMakers has the right to remove inactive accounts under the
              duration that AskMakers sees adequate.
            </p>

            <p className="has-text-weight-bold is-size-5">
              Removal and Blocking of Content and Accounts
            </p>
            <p>
              AskMakers has the right to block or remove content and accounts for
              any reason it sees adequate. In addition, you acknowledge that we
              have your consent to monitor and block content that we consider to
              be harassing or bullying.
            </p>

            <p className="has-text-weight-bold is-size-5">Information</p>
            <p>
              AskMakers has the right to use the information input by users with
              agreement to the privacy policy
            </p>

            <p className="has-text-weight-bold is-size-5">E-mail</p>
            <p>
              AskMakers has the right to e-mail users with what AskMakers sees
              adequate with the option to unsubscribe from notification e-mails
            </p>

            <p className="has-text-weight-bold is-size-5">
              Modifications of Terms and Conditions
            </p>
            <p>
              We have the right to modify terms and conditions if needed and
              whenever adequate
            </p>

            <p className="has-text-weight-bold is-size-5">Limits of Responsibility</p>
            <p>
              All communicated content on the website is the responsibility of
              their owners and AskMakers is not responsible for its content or any
              damage that could result from this content or the use of any of the
              site's services.
            </p>
          </div>
          <div className="content mt-5">
            <h1 className="title mb-5">Privacy Policy</h1>
            <p>
              We care for the privacy & protection of our users and their data and
              we would like to share with you our policy and practices regarding
              your information and its privacy. Our Privacy Policy outlines what
              data is collected from our users and how it is used and processed.
              It also highlights how our users can control their data.
            </p>

            <p className="has-text-weight-bold is-size-5">Definitions</p>
            <p>
              A AskMakers is the question or answer that a user gives to other
              users on the AskMakers platforms. It is also the question or answer
              that a user receives from other users on the AksMakers platforms.
            </p>

            <p className="has-text-weight-bold is-size-5">
              Information that users share with us
            </p>
            <p className="has-text-weight-bold is-size-6">
              General Information About You
            </p>
            <p>
              There are parts of our platforms can be accessed without
              registration, while other parts of our services can only be accessed
              by registered users. To be able to provide our services to you, we
              require that you provide us with some basic information about you.
              This includes your name, e-mail address. E-mail address is necessary
              for account verification and recovery.
            </p>

            <p className="has-text-weight-bold is-size-6">
              Information shared with the public
            </p>
            <p>
              Most of your information is kept in privacy and not shared with the
              public. This includes the AskMakers that are sent or received to and
              from other users. However, some information will appear to the
              public by default. This includes your name, username. If you provide
              us with a profile photo, it will also appear to the public.
            </p>

            <p className="has-text-weight-bold is-size-5">
              Information that we collect from our users
            </p>

            <p className="has-text-weight-bold is-size-6">Timestamps</p>
            <p>
              To make sure that you are protected and that the security and
              stability of the system is intact, we record the date and time of
              actions like:
            </p>
            <ul>
              <li>When you create an account on our platforms</li>
            </ul>

            <p className="has-text-weight-bold is-size-5">Insights</p>
            <p>
              To provide insights for our users, we may analyze AskMakers and user
              activity. Data privacy and confidentiality will be maintained.
            </p>

            <p className="has-text-weight-bold is-size-5">3rd Party Services</p>
            <p className="has-text-weight-bold is-size-6">Email</p>
            <p>
              We may share your data with e-mail providers who facilitate e-mail
              delivery, this may be used for email confirmation, notifications and
              password reset.
            </p>

            <p className="has-text-weight-bold is-size-6">Filtration</p>
            <p>
              In addition to using our own internal systems, we may use
              third-party services, such as Google Firebase to hosting AskMakers
              and authenticate users.
            </p>

            <p className="has-text-weight-bold is-size-6">Analytics Services</p>
            <p>
              AskMakers may utilize services that analyze users’ behavior such as
              Facebook Analytics and Google Analytics. We use these analytics to
              improve our services and enhance the user experience. These services
              may use cookies and may collect certain information about you such
              as your device, websites you visit, how you use our services, your
              activities on our platforms or your demographics. Here, you can
              learn more about Facebook Cookies Policy and Google Analytics
              Privacy Policy.
            </p>

            <p className="has-text-weight-bold is-size-6">Notification Tokens</p>
            <p>
              We use third-party services, such as Google Firebase, to assigns a
              token to your device. This allows us to send you general or directed
              notifications.
            </p>

            <p className="has-text-weight-bold is-size-5">Links to External Sites</p>
            <p>
              Our website may contain links to other sites on the internet or
              advertisements and we are not responsible for the data practices and
              privacy policies of these websites. We may be assisted by third
              party advertising companies for the reason of displaying ads when
              you visit our website. These companies have the right to use general
              information about your visit to this website and other websites.
              This is to show you targeted ads that are more relevant to you.
            </p>

            <p className="has-text-weight-bold is-size-5">
              Disclosure of Information
            </p>
            <p>
              We highly value the confidentiality of your data. We also have to
              protect our users and communities from misusers. To make sure our
              users are protected, we may disclose personal information when
              requested by legal or law-enforcement entities through official
              channels.
            </p>

            <p className="has-text-weight-bold is-size-5">
              Modification of Data Confidentiality and Privacy Policy
            </p>
            <p>
              We have the right to modify the items and conditions of data
              confidentiality and privacy policy if needed and when we see
              adequate
            </p>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
    h1.title {
      font-weight: 700;
      font-size: 1.875rem;
    }
    .has-text-weight-bold.is-size-5 {
      font-weight: 700;
      font-size: 1.5rem;
      margin: 0.75rem 0;
    }
    `}</style>
  </Layout>
  </>
)}

export default TermsPrivacy
