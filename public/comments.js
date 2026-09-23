const commentForm=document.querySelector('#commentForm');
const commentAuthor=document.querySelector('#commentAuthor');
const commentContent=document.querySelector('#commentContent');
const commentWebsite=document.querySelector('#commentWebsite');
const commentCount=document.querySelector('#commentCount');
const commentStatus=document.querySelector('#commentStatus');
const commentSubmit=document.querySelector('#commentSubmit');
const commentsList=document.querySelector('#commentsList');
const commentsTotal=document.querySelector('#commentsTotal');
const dateLabel=value=>new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(String(value).replace(' ','T')+'Z'));
function renderComments(comments){commentsList.replaceChildren();commentsTotal.textContent=`${comments.length} ${comments.length===1?'comentário':'comentários'}`;if(!comments.length){const empty=document.createElement('p');empty.className='comments-state';empty.textContent='Seja a primeira pessoa a comentar.';commentsList.append(empty);return;}comments.forEach(comment=>{const article=document.createElement('article');article.className='comment-item';const header=document.createElement('header');const author=document.createElement('strong');author.textContent=comment.author;const time=document.createElement('time');time.dateTime=comment.createdAt;time.textContent=dateLabel(comment.createdAt);const text=document.createElement('p');text.textContent=comment.content;header.append(author,time);article.append(header,text);commentsList.append(article);});}
async function loadComments(){try{const response=await fetch('/api/comments',{headers:{accept:'application/json'}});if(!response.ok)throw new Error();const data=await response.json();renderComments(data.comments||[]);}catch(_){commentsList.innerHTML='<p class="comments-state error">Não foi possível carregar os comentários agora.</p>';commentsTotal.textContent='';}}
commentContent.addEventListener('input',()=>{commentCount.value=commentContent.value.length;});
commentForm.addEventListener('submit',async event=>{event.preventDefault();commentSubmit.disabled=true;commentStatus.textContent='Publicando…';try{const response=await fetch('/api/comments',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({author:commentAuthor.value,content:commentContent.value,website:commentWebsite.value})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Não foi possível publicar.');commentContent.value='';commentCount.value=0;commentStatus.textContent='Comentário publicado.';await loadComments();}catch(error){commentStatus.textContent=error instanceof Error?error.message:'Não foi possível publicar. Tente novamente.';}finally{commentSubmit.disabled=false;}});
loadComments();
