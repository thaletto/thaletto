import nextConfig from "@/next.config";
import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: nextConfig.env?.NOTION_TOKEN,
});

type NotionProperty = {
  type: string;
  [key: string]: any;
};

export function formatNotionResponse(results: any[]) {
  return results.map((page: any) => {
    const formattedProperties: Record<string, any> = {};

    Object.entries(page.properties).forEach(([key, value]) => {
      const property = value as NotionProperty;
      switch (property.type) {
        case "title":
          formattedProperties[key] = property.title[0]?.plain_text || "";
          break;
        case "rich_text":
          formattedProperties[key] = property.rich_text[0]?.plain_text || "";
          break;
        case "date":
          formattedProperties[key] = property.date?.start || null;
          break;
        case "select":
          formattedProperties[key] = property.select?.name || null;
          break;
        case "multi_select":
          formattedProperties[key] = property.multi_select.map(
            (item: any) => item.name
          );
          break;
        case "number":
          formattedProperties[key] = property.number || null;
          break;
        case "checkbox":
          formattedProperties[key] = property.checkbox || false;
          break;
        case "url":
          formattedProperties[key] = property.url || null;
          break;
        case "email":
          formattedProperties[key] = property.email || null;
          break;
        case "phone_number":
          formattedProperties[key] = property.phone_number || null;
          break;
        default:
          formattedProperties[key] = null;
      }
    });

    return formattedProperties;
  });
}
