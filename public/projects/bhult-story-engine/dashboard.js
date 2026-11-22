const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dateLabel = (value) => value ? new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date(value)) : "—";
const statusClass = (value) => value === "Passed" ? "passed" : value === "Failed" ? "failed" : value === "Running" ? "running" : "";
async function loadDashboard(){
  try{
    const response=await fetch("/api/bhult-dashboard",{headers:{Accept:"application/json"}});
    if(!response.ok) throw new Error("Dashboard request failed");
    const data=await response.json();
    $("updated").textContent="Updated "+new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(data.generatedAt));
    $("branches").innerHTML=(data.branches||[]).map(b=>`<article class="branch-card"><div class="branch-top"><span class="branch-name">${escapeHtml(b.name)}</span><span class="status ${statusClass(b.status)}">${escapeHtml(b.status)}</span></div><div class="branch-sha">${b.sha?"Latest commit "+escapeHtml(b.sha):"Branch status unavailable"}</div><a class="branch-link" href="${escapeHtml(b.url)}" target="_blank" rel="noopener">View branch on GitHub ↗</a></article>`).join("");
    $("open-count").textContent=(data.openPullRequests||[]).length+" open";
    $("open-prs").innerHTML=(data.openPullRequests||[]).length?(data.openPullRequests||[]).map(p=>`<tr><td><a href="${escapeHtml(p.pullUrl)}" target="_blank" rel="noopener">#${p.number} · ${escapeHtml(p.title)}</a></td><td class="branch-cell"><a href="${escapeHtml(p.branchUrl)}" target="_blank" rel="noopener">${escapeHtml(p.branch)}</a></td><td><span class="status">${escapeHtml(p.status)}</span></td><td>${dateLabel(p.updatedAt)}</td></tr>`).join(""):'<tr><td colspan="4" class="empty">No open feature pull requests.</td></tr>';
    $("merged-prs").innerHTML=(data.recentMerges||[]).length?(data.recentMerges||[]).map(p=>`<tr><td>${escapeHtml(p.title)}</td><td class="branch-cell"><a href="${escapeHtml(p.branchUrl)}" target="_blank" rel="noopener">${escapeHtml(p.branch)}</a></td><td><a href="${escapeHtml(p.pullUrl)}" target="_blank" rel="noopener">#${p.number} ↗</a></td><td>${dateLabel(p.mergedAt)}</td></tr>`).join(""):'<tr><td colspan="4" class="empty">No merged pull requests found.</td></tr>';
  }catch(error){$("error").hidden=false;$("updated").textContent="Status unavailable";$("branches").innerHTML="";$("open-prs").innerHTML='<tr><td colspan="4" class="empty">Could not load project metadata.</td></tr>';$("merged-prs").innerHTML='<tr><td colspan="4" class="empty">Could not load release history.</td></tr>';}
}
loadDashboard();
