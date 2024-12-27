import build from 'pino-abstract-transport'
import axios from 'axios'

async function sendToSlack(webhook: string, channel: string, obj: any) {
  try {
    let text = ''
    if (obj && 'msg' in obj && typeof obj.msg === 'string') {
      text += `${obj.msg}\n\n`
    }

    text += `\`\`\`${JSON.stringify(obj, null, 2)}\`\`\``

    const res = await axios.post(webhook, {
      headers: {
        'Content-Type': 'application/json',
      },
      channel,
      text,
    })

    if (res.status !== 200) {
      console.error('Failed to send log to Slack', res)
    }
  } catch (e) {
    console.error('Failed to send log to Slack', e)
  }
}

type Opts = {
  channel: string
  webhook: string
}

export default async function pinoSlackTransport(opts: Opts) {
  return build(async (src) => {
    for await (const obj of src) {
      await sendToSlack(opts.webhook, opts.channel, obj)
    }
  })
}
