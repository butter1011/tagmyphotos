import "../public/css/normalize.css";
import "../public/css/tag-my-photos.webflow.css";
import "../public/css/webflow.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="nav-bar">
        <div className="logo-wrapper">
          <div className="logotype">Tag My Photos™</div>
          <div className="tagline">Free Microstock Keywording Tool</div>
        </div>
        <Link href="/home">
          <button className="button login ">Tag My Photos</button>
        </Link>
      </section>
      <section className="header">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="heading" id="free">The <span className="underline" >FREE</span><span>*</span> Way to Generate Titles &amp; Tags for Stock Photos</h1>
          <p className="sub-headline">Tag My Photos™ is a free-to-use web application to generate titles and tags for your microstock photos, illustrations &amp; ai-generated artworks.</p>
          <div className="w-full justify-center my-4 p-2">
            <Link href="/signup" className="button text-white register_free">Register FREE</Link>
          </div>
        </div>
        <div>*Requires your own OpenAI API key</div>
        <div className="how-it-works">
          <h1 className="heading-2"><span className="highlight">How It Works</span></h1>
          <div id="w-node-ae4dbe44-8641-9f7a-d37e-308d5099b347-f76535e8" className="w-layout-layout quick-stack wf-layout-layout">
            <div id="w-node-ae4dbe44-8641-9f7a-d37e-308d5099b348-f76535e8" className="w-layout-cell cell">
              <h1 className="step-title">1. Create an Account</h1>
              <p>Create a free account on Tag My Photos. It&#x27;s completely free and only requires an email address.</p>
            </div>
            <div id="w-node-ae4dbe44-8641-9f7a-d37e-308d5099b349-f76535e8" className="w-layout-cell cell">
              <h1 className="step-title">2. Enter Your OpenAi API Key</h1>
              <p>Navigate to the settings page and paste in your own OpenAI API key. Don&#x27;t have one?
                <Link href="https://platform.openai.com/api-keys" target="_blank" className="link">
                  <span className="underline mx-1">Get one here</span>
                </Link>.
              </p>
            </div>
            <div id="w-node-e1226139-d078-bc27-e030-3d376f567f41-f76535e8" className="w-layout-cell cell">
              <h1 className="step-title">3. Generate &amp; Export Keywords</h1>
              <p>Once your API key is saved, you can begin generating titles &amp; keywords for your stock photos and export them in a handy CSV.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="header-image-wrapper">
        <img src="images/homepageimage.png" loading="lazy" sizes="(max-width: 1501px) 100vw, 1501px" srcSet="images/homepageimage.png 500w, images/homepageimage.png 800w, images/homepageimage.png 1080w, images/homepageimage.png 1501w" alt="" className="image" />
      </div>
      <section className="footer-section m-0">
        <div>Created &amp; maintained for free by <Link href="https://brandpacks.com"><span className="underline text-blue-600">BrandPacks</span></Link> to support fellow microstock creators.
        </div>
      </section>
    </>
  );
}
