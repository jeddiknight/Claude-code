import { TravelPlan } from "./types";

const DAY_COLORS = ["ff0000ff","ff00ff00","ffff0000","ff00ffff","ffff00ff","ffffff00","ff8800ff","ff0088ff"];

function escapeXml(str: string): string {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}

export function generateKML(plan: TravelPlan): string {
  const styles = DAY_COLORS.map((color, i) => `
  <Style id="day${i+1}"><IconStyle><color>${color}</color><scale>1.2</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/${i+1}.png</href></Icon></IconStyle></Style>`).join("");

  const folders = plan.days.map((day) => {
    const ci = (day.day-1) % DAY_COLORS.length;
    const placemarks = day.locations.map((loc) =>
      `<Placemark><name>${escapeXml(loc.name)}</name><description><![CDATA[<b>${escapeXml(loc.type.toUpperCase())}</b><br/>${escapeXml(loc.description)}<br/><b>Trukmė:</b> ${escapeXml(loc.duration)}<br/><b>Kaina:</b> ${escapeXml(loc.cost)}]]></description><styleUrl>#day${ci+1}</styleUrl><Point><coordinates>${loc.lng},${loc.lat},0</coordinates></Point></Placemark>`
    ).join("");
    return `<Folder><name>${escapeXml(day.day+" Diena: "+day.title)}</name><description>${escapeXml(day.tips)}</description>${placemarks}</Folder>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${escapeXml(plan.title)}</name><description>${escapeXml(plan.summary)}</description>${styles}${folders}</Document></kml>`;
}
