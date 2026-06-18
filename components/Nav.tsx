const links=[['/dashboard','Dashboard'],['/sources','Sources'],['/preferences','Preferences'],['/archive','Archive'],['/setup','Setup']];
export function Nav(){return <div className="nav"><a className="brand" href="/">◐ Daily Briefing Agent</a><div className="tabs">{links.map(([href,label])=><a className="tab" key={href} href={href}>{label}</a>)}</div></div>}
