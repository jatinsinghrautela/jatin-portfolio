import type {SiteContent} from './content-model';
type Role=SiteContent['experience'][number];
// A display range may use an em dash, en dash, hyphen or "to".
// Sort by the start of the role; ongoing employment wins over completed roles.
export function employmentStart(date:string){
 const normalized=date.replace(/\b(\d{4})-(\d{2})\b/g,'$1/$2/01');
 const start=normalized.split(/\s+(?:[—–-]|to)\s+/i)[0].trim();
 const year=start.match(/\b(?:19|20)\d{2}\b/);
 if(!year)return 0;
 const month=start.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
 if(month)return Number(year[0])*12+['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(month[1].toLowerCase());
 const numeric=start.match(/(?:19|20)\d{2}[/-](\d{1,2})/);
 return Number(year[0])*12+(numeric?Math.max(0,Math.min(11,Number(numeric[1])-1)):0);
}
const ongoing=(r:Role)=>/\b(present|current|now|ongoing)\b/i.test(r.date);
export function groupExperience(experience:Role[]){
 const sorted=[...experience].sort((a,b)=>Number(ongoing(b))-Number(ongoing(a))||employmentStart(b.date)-employmentStart(a.date));
 const groups=new Map<string,{company:string;roles:Role[]}>();
 for(const role of sorted){const company=role.company.trim()||'Independent work',key=company.toLocaleLowerCase();if(!groups.has(key))groups.set(key,{company,roles:[]});groups.get(key)!.roles.push(role)}
 return [...groups.values()];
}
