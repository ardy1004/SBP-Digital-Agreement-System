import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ASSETS: Record<string, { url: string; contentType: string }> = {
  logo: {
    url: "https://images.salambumi.xyz/materai/fav.webp",
    contentType: "image/webp",
  },
  materai: {
    url: "https://images.salambumi.xyz/materai/hg.png",
    contentType: "image/png",
  },
  "signature-agent": {
    url: "https://images.salambumi.xyz/materai/gsd-removebg-preview%20-%20Copy.png",
    contentType: "image/png",
  },
};

router.get("/assets/:name", async (req, res) => {
  const asset = ASSETS[req.params.name];
  if (!asset) {
    res.status(404).json({ error: "Asset not found" });
    return;
  }

  try {
    const upstream = await fetch(asset.url);
    if (!upstream.ok) {
      res.status(502).json({ error: "Failed to fetch asset" });
      return;
    }

    const buffer = await upstream.arrayBuffer();
    res.set({
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    });
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(502).json({ error: "Asset proxy error" });
  }
});

export default router;
