import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#0d1109' }}>
      {/* Left Side: Branding & Info */}
      <div className="mobile-hide" style={{ 
        width: '50%', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '4rem', 
        backgroundColor: '#0a0d07', 
        overflow: 'hidden' 
      }}>
        {/* Background Image with Overlay */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: 0.4,
            backgroundImage: `url('https://res.cloudinary.com/doajstql7/image/upload/v1775879081/Elk_Valley_sunset_workshop_scene_gvwak0.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ 
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10, 13, 7, 1) 0%, rgba(10, 13, 7, 0) 50%, rgba(10, 13, 7, 1) 100%)',
          zIndex: 1
        }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/">
            <Image 
              src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
              alt="Kootenay Signal Logo" 
              width={120}
              height={120}
            />
          </Link>
          <div style={{ marginTop: '3rem' }}>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 4vw, 4rem)', 
              lineHeight: 0.9, 
              fontFamily: 'var(--font-syne)', 
              fontWeight: 800,
              color: '#fff',
              textTransform: 'uppercase',
              marginBottom: '1.5rem'
            }}>
              Join the Local <br />
              <span style={{ color: '#e67e22' }}>Elite.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '500px', lineHeight: 1.4, fontFamily: 'var(--font-pjs)' }}>
              Register your business for the Kootenay Broadcast™ <br />and start owning your territory today.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <p style={{ opacity: 0.5, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-pjs)' }}>
            &copy; {new Date().getFullYear()} Kootenay Signal Agency • Local Dominance Secured
          </p>
        </div>
      </div>

      {/* Right Side: Clerk Form */}
      <div 
        style={{ 
          width: '100%',
          flex: 1,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          backgroundColor: '#0d1109',
          borderLeft: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Custom Header Above Form */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link href="/">
              <Image 
                src="https://res.cloudinary.com/doajstql7/image/upload/v1775879112/ChatGPT_Image_Apr_10__2026__11_27_53_PM-removebg-preview_vjtdqa.png" 
                alt="Kootenay Signal Logo" 
                width={70}
                height={70}
                style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(230, 126, 34, 0.2))' }}
              />
            </Link>
            <h2 style={{ 
              fontFamily: 'var(--font-syne)', 
              fontSize: '1.75rem', 
              fontWeight: 800, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              color: 'white',
              margin: 0
            }}>
              Join The Elite
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-pjs)', 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.2em',
              marginTop: '0.5rem'
            }}>
              Register Your Territory Today
            </p>
          </div>

          <SignUp 
            appearance={{
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
              },
              elements: {
                rootBox: { width: "100%" },
                card: { 
                   backgroundColor: "transparent", 
                   border: "none", 
                   boxShadow: "none",
                   padding: "0",
                   width: "100%",
                },
                header: { display: 'none' }, 
                main: { display: 'flex', flexDirection: 'column' },
                socialButtonsBlockButton: { 
                  backgroundColor: "#11140e", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  color: "white", 
                  transition: "all 0.3s ease",
                  borderRadius: "2px",
                  height: "48px"
                },
                socialButtonsBlockButtonText: { fontFamily: "var(--font-pjs)", fontWeight: "700", textTransform: 'uppercase', letterSpacing: '0.1em' },
                dividerText: { color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-pjs)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem" },
                dividerLine: { backgroundColor: "rgba(255,255,255,0.05)" },
                formFieldLabel: { 
                  color: "rgba(255,255,255,0.6)", 
                  fontFamily: "var(--font-pjs)", 
                  fontWeight: "800", 
                  textTransform: "uppercase", 
                  fontSize: "0.65rem", 
                  letterSpacing: "0.15em",
                  marginBottom: "0.5rem"
                },
                formFieldInput: { 
                  backgroundColor: "#11140e", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  color: "white", 
                  borderRadius: "2px", 
                  padding: "0.75rem",
                  fontFamily: "var(--font-pjs)"
                },
                formButtonPrimary: { 
                  backgroundColor: "#e67e22", 
                  color: "white", 
                  fontWeight: "900", 
                  padding: "1rem", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.2em", 
                  fontSize: "0.8rem", 
                  borderRadius: "2px", 
                  transition: "all 0.3s ease",
                  marginTop: "1.5rem",
                  boxShadow: "0 4px 20px rgba(230, 126, 34, 0.15)"
                },
                footer: { display: 'none' }, 
                identityPreviewText: { color: "white" },
                identityPreviewEditButtonIcon: { color: "#e67e22" },
                formFieldAction: { color: "#e67e22", fontWeight: "800", textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.1em' },
              }
            }}
          />

          {/* Re-implemented Clean Footer */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ fontFamily: 'var(--font-pjs)', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link href="/sign-in" style={{ color: '#e67e22', fontWeight: 800, textDecoration: 'none', marginLeft: '0.5rem', letterSpacing: '0.05em' }}>
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
