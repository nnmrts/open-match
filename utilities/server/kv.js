const {
	openKv
} = Deno;

const kv = await openKv();

const reset = async () => {
	for await (const { key } of kv.list({ prefix: ["rooms"] })) {
		kv.delete(key);
	}
};

// reset();

export default kv;
