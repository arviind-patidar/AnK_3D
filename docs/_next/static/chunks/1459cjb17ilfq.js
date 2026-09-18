(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,55054,e=>{"use strict";var o=e.i(47167);e.s(["GeminiAnalyzerService",0,class{apiKey;constructor(e){this.apiKey=e||o.default.env.GEMINI_API_KEY||window.GEMINI_API_KEY||""}async analyzeFloorPlan(e,o="image/jpeg",t="Uploaded Residential Plan",r="Residential Layout"){let a=e.replace(/^data:image\/\w+;base64,/,""),n=`
You are an expert architectural floor-plan analysis engine for Acre&Key Property Advisory.
Inspect this residential floor plan image at full resolution.

Strict Analysis Directive:
1. Extract ALL rooms, wall boundaries, room codes, room names, printed dimensions, and calculated areas.
2. Extract structural elements:
   - Doors (positions, swing direction if clear)
   - Windows (positions, type if clear)
   - Balconies & Terraces
   - Stairs (location, flight type, direction)
   - Voids / OTS (Open to Sky) / Shafts
   - Furniture Anchors (beds, sofas, dining tables, kitchen counters, vanity counters)
3. Assign a 'confidenceScore' (0.00 to 1.00) for every detected room and opening.
4. CRITICAL: DO NOT GUESS. If a printed dimension is unreadable or ambiguous, set dimensions: "NR" or "REVIEW_REQUIRED" and calculatedSqFt: "NR". Set confidenceScore below 0.80.

Return ONLY a single valid JSON object following this strict schema:
{
  "propertyName": "${t}",
  "layoutType": "${r}",
  "superBuiltUpAreaSqFt": null,
  "reraCarpetAreaSqFt": null,
  "balconyCarpetAreaSqFt": null,
  "confidenceScore": 0.95,
  "rooms": [
    {
      "code": "LR",
      "name": "Formal Living",
      "type": "living",
      "dimensions": "14'0" \xd7 19'9"",
      "calculatedSqFt": 276,
      "confidenceScore": 0.98,
      "polygon": [[0.48, 0.28], [0.88, 0.28], [0.88, 0.70], [0.48, 0.70]],
      "doors": [{ "id": "d1", "position": [0.48, 0.50], "swingDirection": "inward", "confidenceScore": 0.92 }],
      "windows": [{ "id": "w1", "position": [0.68, 0.28], "type": "full_height", "confidenceScore": 0.95 }],
      "furniture": [{ "id": "f1", "type": "sofa", "position": [0.58, 0.42], "label": "L-Sectional Sofa", "confidenceScore": 0.90 }]
    }
  ],
  "stairs": [],
  "voids": [],
  "entrances": [[0.82, 0.72]]
}
Return ONLY raw JSON, no markdown formatting.
`;try{if(!this.apiKey)throw Error("Gemini API key missing.");let t=`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${this.apiKey}`,r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{inline_data:{mime_type:o,data:a}},{text:n}]}]})});if(!r.ok)throw Error(`Gemini Multimodal API returned status ${r.status}`);let i=await r.json(),s=(i.candidates?.[0]?.content?.parts?.[0]?.text||"").match(/\{[\s\S]*\}/);if(s){let o=JSON.parse(s[0]);return this.constructStructuredJSON(o,e)}}catch(e){console.warn("[GeminiAnalyzer] Multimodal Vision API call failed, invoking structured topology parser:",e)}return this.constructFallbackJSON(t,r,e)}constructStructuredJSON(e,o){let t=(e.rooms||[]).map((e,o)=>({id:`r_${e.code?.toLowerCase()||o}`,code:e.code||`R${o+1}`,name:e.name||"Room",type:e.type||"living",polygon:e.polygon||[[.2,.2],[.8,.2],[.8,.8],[.2,.8]],dimensions:e.dimensions||"NR",calculatedSqFt:"number"==typeof e.calculatedSqFt?e.calculatedSqFt:"NR",isCarpetArea:!1,floorKey:"lower",doors:e.doors||[],windows:e.windows||[],furniture:e.furniture||[],confidenceScore:"number"==typeof e.confidenceScore?e.confidenceScore:.85,status:.85>(e.confidenceScore||.85)||"NR"===e.dimensions?"REVIEW_REQUIRED":"APPROVED"}));return{projectId:`proj-${Date.now()}`,metadata:{propertyName:e.propertyName||"Uploaded Floor Plan",layoutType:e.layoutType||"Residential Layout",superBuiltUpAreaSqFt:e.superBuiltUpAreaSqFt||void 0,reraCarpetAreaSqFt:e.reraCarpetAreaSqFt||void 0,balconyCarpetAreaSqFt:e.balconyCarpetAreaSqFt||void 0,numFloors:1},analysisTimestamp:new Date().toISOString(),confidenceScore:e.confidenceScore||.9,ambiguities:[],floors:{lower:{floorKey:"lower",floorName:"MAIN FLOOR PLAN",sourceImageUrl:o,renderImageUrl:"",entrances:e.entrances||[[.5,.5]],floorConnections:[],stairs:e.stairs||[],voids:e.voids||[],rooms:t}}}}constructFallbackJSON(e,o,t){return{projectId:`fallback-${Date.now()}`,metadata:{propertyName:e,layoutType:o,numFloors:1},analysisTimestamp:new Date().toISOString(),confidenceScore:.85,ambiguities:[],floors:{lower:{floorKey:"lower",floorName:"MAIN FLOOR PLAN",sourceImageUrl:t,renderImageUrl:"",entrances:[[.5,.5]],floorConnections:[],stairs:[],voids:[],rooms:[]}}}}}])}]);