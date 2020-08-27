import 'reflect-metadata'; //likely needed when swapping out mikro-orm
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from './entities/post';
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(3030, () => {
    console.log("server started on 3030 ✨");
  });
  app.get("/", (_, res) => {
    res.send("hello home");
  });
  // const post = orm.em.create(Post, {title: 'first post'})
  // await orm.em.persistAndFlush(post);

  const found = await orm.em.find(Post, {});
  console.log('found', found);
};

main().catch((err) => console.error(err));
