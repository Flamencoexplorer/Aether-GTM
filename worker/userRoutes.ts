import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
import { AppController as AppControllerClass } from './app-controller';
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
function getGtmController(env: Env): DurableObjectStub<AppControllerClass> {
    const id = env.APP_CONTROLLER.idFromName("gtm-controller");
    return env.APP_CONTROLLER.get(id);
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // GTM System API Routes
    const gtmApi = new Hono<{ Bindings: Env }>();
    gtmApi.post('/start', async (c) => {
        const controller = getGtmController(c.env);
        await controller.start();
        return c.json({ success: true, data: { message: 'GTM mission started.' } });
    });
    gtmApi.get('/status', async (c) => {
        const controller = getGtmController(c.env);
        const data = await controller.getStatus();
        return c.json({ success: true, data });
    });
    gtmApi.get('/agents', async (c) => {
        const controller = getGtmController(c.env);
        const data = await controller.getAgents();
        return c.json({ success: true, data });
    });
    gtmApi.get('/pipeline', async (c) => {
        const controller = getGtmController(c.env);
        const data = await controller.getPipeline();
        return c.json({ success: true, data });
    });
    gtmApi.get('/settings', async (c) => {
        const controller = getGtmController(c.env);
        const data = await controller.getSettings();
        return c.json({ success: true, data });
    });
    gtmApi.post('/settings', async (c) => {
        const controller = getGtmController(c.env);
        const newSettings = await c.req.json();
        await controller.updateSettings(newSettings);
        return c.json({ success: true });
    });
    gtmApi.get('/hitl_queue', async (c) => {
        const controller = getGtmController(c.env);
        const data = await controller.getHitlQueue();
        return c.json({ success: true, data });
    });
    gtmApi.post('/hitl_queue/:id', async (c) => {
        const controller = getGtmController(c.env);
        const { id } = c.req.param();
        const { resolution } = await c.req.json();
        await controller.resolveHitlAction(id, resolution);
        return c.json({ success: true });
    });
    app.route('/api/v1/gtm_system', gtmApi);
}