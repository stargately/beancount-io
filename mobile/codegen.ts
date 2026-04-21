import type { CodegenConfig } from "@graphql-codegen/cli";

const schema =
  (process.env.EXPO_PUBLIC_SERVER_URL &&
    process.env.EXPO_PUBLIC_SERVER_URL + "api-gateway/") ||
  "https://beancount.io/api-gateway/";

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: "src/common/graphql/**/*.graphql",
  generates: {
    "src/generated-graphql/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        scalars: {
          JSONObject: "Record<string, number | string>",
        },
      },
    },
    "src/generated-graphql/graphql.schema.json": {
      plugins: ["introspection"],
    },
    "src/generated-graphql/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
