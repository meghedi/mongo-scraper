$(document).ready(function(){
});
$('#scrapeBtn').on('click', function(){
    $('#scrapedArticles').empty();
    $.ajax({
        url:'api/deleteall',
        method: 'DELETE'
    }).then(function(){
      console.log('deleted');
    });
    $.get('/scrape', function(data){
       $('#myModal').modal();
       $('#addedArticlesCount').append(`<h3>Added ${data.length} articles</h3>`);
       $('#noScraped').css('display','none');
    });
});


$('#myModal, .saveNotes').on('hidden.bs.modal', function () {
  window.location.reload();
  });


  $(document).on('click', '.saveArticleBtn', function(event){
      event.preventDefault();
      alert('Article Saved');
      let id = $(this).data('articleid');
      $.ajax({
          url:'/api/updateArticle/'+ id,
          method: 'PUT',
      }).then(function(data){
         console.log('saved Article ');
         window.location.href="/savedArticles";
    })
  });

  $(document).on('click','.articleNotes', function(){
      $('.saveNotes').modal();
      $('.saveNotesLabel').text(`Notes for Article ${$(this).data('id')}`);
      $('.saveNotesLabel').append(`<input type="hidden" id="articleId" value=${$(this).data('id')}>`);

      $.ajax({
          url: '/api/articles/'+ $(this).data('id'),
          method: 'GET'
      }).then(function(noteRes){
          let notesContent = '';
          noteRes.forEach(element =>{
            notesContent +=`<div class="card ">
            <div class="card-body"><p class="card-text">${element.title} <br>${element.body}</p>
            <a class="deleteNoteBtn btn btn-danger" data-noteid=${element._id} href="">X</a></div></div>`;
          });
          $('.notesCard').prepend(notesContent);
      });

  });

  $(document).on('click','.saveNoteBtn', function(){
      const title = $('#note-title').val();
      const body = $('#note-body').val();
     const notedata = {
          title,
          body,
          article: $('#articleId').val()
     }
     $.ajax({
         url: '/api/createNote/',
         method:'POST',
         data: notedata
     }).then(function(dbNote){
             let innerContent = `<div class="card ">
             <div class="card-body"><p class="card-text">${dbNote.title} <br>${dbNote.body}</p>
             <a class="deleteNoteBtn btn btn-danger" data-noteid=${dbNote._id} href="">X</a></div></div>`;
             $('.notesCard').prepend(innerContent);
     })
  });

  $(document).on('click', '.deleteNoteBtn', function(){
    $.ajax({
        url:'/api/deleteNote/' + $(this).data('noteid'),
        method: 'DELETE'
    }).then(function(){
      console.log('deleted');
    });
  });

  $(document).on('click', '.deleteBtn', function(){
      let id = $(this).data('id');
      $.ajax({
        url:'/api/deleteFromSaved/' + id,
        method : 'PUT'
      }).then(()=>{
        $(this).closest('.card').remove();
      })
  });
