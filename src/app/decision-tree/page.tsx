
import { groq } from "next-sanity";
import { sanityFetch, client } from "@/sanity/client";
import Link from "next/link";
import { DECISION_TREE_QUERYResult } from "@/sanity/types";
import { flatDataToTree } from '../utils'
import util from 'util'
import { createNextPageTreeClient } from '@q42/sanity-plugin-page-tree/next';

const pageTreeClient = createNextPageTreeClient({
  config: {
    /* Root page schema type name */
    rootSchemaType: 'decisionTreeTemplate',
    /* Array of all page schema type names */
    pageSchemaTypes: ['question', 'decisionTreeTemplate'],
    /* Api version to be used in all underlying Sanity client use */
    allowedParents: {
      question: ['question', 'decisionTreeTemplate']
    },
    apiVersion: '2023-12-08',
    /* Optionally provide the field name of the title field of your page documents, to be used to generate a slug automatically for example. */
    titleFieldName: 'title',
    /* Used for showing the full url for a document and linking to it. */
    /* optional, otherwise the path is shown */
    baseUrl: 'https://example.com',
  },
  client: client,
});

const DECISION_TREE_QUERY = groq`*[_id == "decision-tree"][0]{
  tree[] {
    _key,
    _type,
    parent,
    value {
      reference->{
        title,
        name,
        slug,
        content,
      }
    }
  }
}`;

export default async function DecisionTreePage() {
  const decisionTreeFlat = await sanityFetch<DECISION_TREE_QUERYResult>({
    query: DECISION_TREE_QUERY,
  });
  const tree = decisionTreeFlat?.tree && flatDataToTree(decisionTreeFlat.tree)
  //const anotherTree = await pageTreeClient.getPageMetadataByPath('/test-question/another-question')
  console.log(util.inspect(tree, { showHidden: false, depth: null, colors: true }))
  //console.log(util.inspect(anotherTree, { showHidden: false, depth: null, colors: true }))
  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <p>
        test
      </p>
    </main >
  );
}