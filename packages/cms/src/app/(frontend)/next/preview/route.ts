import jwt from "jsonwebtoken";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@cms/payload.config";
import { CollectionSlug } from "payload";

const payloadToken = "payload-token";

export async function GET(
  req: Request & {
    cookies: {
      get: (name: string) => {
        value: string;
      };
    };
  },
): Promise<Response> {
  const payload = await getPayloadHMR({ config: configPromise });
  const token = req.cookies.get(payloadToken)?.value;
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection") as CollectionSlug;
  const id = searchParams.get("id");

  const previewSecret = searchParams.get("previewSecret");

  if (previewSecret) {
    return new Response("You are not allowed to preview this page", {
      status: 403,
    });
  } else {
    if (!collection) {
      return new Response("No collection provided", { status: 404 });
    }

    if (!id) {
      return new Response("No id provided", { status: 404 });
    }

    if (!token) {
      new Response("You are not allowed to preview this page", { status: 403 });
    }

    let user;

    try {
      user = jwt.verify(token, payload.secret);
    } catch (error) {
      payload.logger.error("Error verifying token for live preview:", error);
    }

    const draft = await draftMode();

    // You can add additional checks here to see if the user is allowed to preview this page
    if (!user) {
      draft.disable();
      return new Response("You are not allowed to preview this page", {
        status: 403,
      });
    }

    // Verify the given slug exists
    try {
      const doc = await payload.findByID({
        collection: collection,
        id,
      });

      if (!doc) {
        return new Response("Document not found", { status: 404 });
      }
    } catch (error) {
      payload.logger.error("Error verifying token for live preview:", error);
    }

    draft.enable();

    redirect(`/preview/${collection}/${id}`);
  }
}
