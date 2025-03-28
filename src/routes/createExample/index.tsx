import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import Drizzler from "../../../drizzle";
import { schema } from "../../../drizzle/schema";

export const useCreateUser = routeAction$(
  async (data) => {
    const db = Drizzler();
    try {
      await db.insert(schema.users).values(data);
      return {
        success: true,
        data: {
          name: data.name,
          email: data.email
        }
      };
    } catch (error: any) {
      console.error("Error creating user: ", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
  zod$({
    name: z.string(),
    email: z.string().email(),
  }),
);

export default component$(() => {
  const createUserAction = useCreateUser();
  return (
    <section>
      <h1>Create User</h1>
      <Form action={createUserAction}>
        <label>
          Name
          <input name="name" value={createUserAction.formData?.get("name")} />
        </label>
        <label>
          Email
          <input name="email" value={createUserAction.formData?.get("email")} />
        </label>
        <button type="submit">Create</button>
      </Form>
      {createUserAction.value?.success && (
        <div>
          <h2>¡Usuario creado exitosamente!</h2>
          {createUserAction.value.data && (
            <>
              <p>Nombre: {createUserAction.value.data.name}</p>
              <p>Email: {createUserAction.value.data.email}</p>
            </>
          )}
        </div>
      )}
      {createUserAction.value?.success === false && (
        <div>
          <h2>Error al crear usuario</h2>
          <p>{createUserAction.value.error}</p>
        </div>
      )}
    </section>
  );
});
