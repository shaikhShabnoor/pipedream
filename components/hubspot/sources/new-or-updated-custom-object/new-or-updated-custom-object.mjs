import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-custom-object",
  name: "New or Updated Custom Object",
  description: "Emit new event each time a Custom Object of the specified object type is updated.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    customObjectType: {
      propDefinition: [
        common.props.hubspot,
        "customObjectType",
      ],
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(object) {
      const {
        id,
        updatedAt,
      } = object;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: `Record ID: ${id}`,
        ts,
      };
    },
    isRelevant(object, updatedAfter) {
      return Date.parse(object.updatedAt) > updatedAfter;
    },
    getParams() {
      return null;
    },
    getObjectParams(object) {
      const propertyName = (object == "contacts")
        ? "lastmodifieddate"
        : "hs_lastmodifieddate";
      return {
        limit: 100,
        sorts: [
          {
            propertyName,
            direction: "DESCENDING",
          },
        ],
        object,
      };
    },
    async processResults(after) {
      const object = (this.objectType == "company")
        ? "companies"
        : `${this.objectType}s`;
      const params = this.getObjectParams(object);
      await this.searchCRM(params, after);
    },
  },
};
