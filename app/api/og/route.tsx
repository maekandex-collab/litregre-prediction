import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Free Daily Football Predictions & Expert Tips";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0f2744 0%, #1a3a6b 50%, #1d4ed8 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(29, 78, 216, 0.3)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #0f2744)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>LG</span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            LitreGre Prediction
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            margin: "0 0 20px 0",
            maxWidth: "800px",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Premier League, Champions League, La Liga, Serie A, and 50+ leagues covered daily.
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["1X2", "BTTS", "Over 2.5", "VIP Tips", "Special Bets"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            litregre-prediction.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
