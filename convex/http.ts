import { Webhook } from 'svix';
import { httpAction } from './_generated/server';
import { httpRouter } from "convex/server";
import { WebhookEvent } from '@clerk/nextjs/server';

const http = httpRouter();

http.route({
  path: '/clerk-webhook',
  method: 'POST',

  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Webhook secret not set');
    }

    const svix_id = req.headers.get('svix-id');
    const svix_signature = req.headers.get('svix-signature');
    const svix_timestamp = req.headers.get('svix-timestamp');

    if(!svix_id || !svix_signature || !svix_timestamp) {
      return new Response('Missing headers', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.log(error)
      return new Response('Invalid signature', { status: 400 });
    }

    const eventType = evt.type;
    if(eventType === "user.created"){
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name} ${last_name}`.trim();

      try {
        //save user to db;
      } catch (error: any) {
        return new Response(error.essage, { status: 500 });
      }
    }

    return new Response('webhook processed sucessfully', {status: 200})
  })
})

export default http;
