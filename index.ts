// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";

export const Root = {
  incidents: () => ({}),
};

export const IncidentCollection = {
  one: async (args) => {
    const res = await api("GET", `incidents/${args.id}`);

    return res.incident;
  },
  page: async (args) => {
    const res = await api("GET", "incidents", args);

    return {
      items: res.incidents,
      next: () => ({}),
    };
  },
};

export const Incident = {
  gref: (_, { obj }) => {
    return root.incidents.one({ id: obj!.id });
  },
};

export async function configure({ apiKey, routingKey }) {
  state.apiKey = apiKey ?? state.apiKey;
  state.routingKey = routingKey ?? state.routingKey;
}

// This is a helper function to make API calls to PagerDuty
async function api(method: string, path: string, body?: any) {
  const response: any = await fetch(`https://api.pagerduty.com/${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: `Token token=${state.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

// Handles the program's HTTP endpoint
export async function endpoint(args) {
  return `Path: ${args.path}`;
}