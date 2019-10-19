$(function() {
  $(document).on('turbolinks:load', function () {

    var search_list = $("#user-search-result");
    var selected_list = $("#chat-group-users");

    function appendList(user) {  //検索結果の表示
      var html = `<div class="chat-group-user clearfix search" id="${ user.id }_search">
                    <p class="chat-group-user__name">${ user.name }</p>
                    <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" id="${ user.id }_add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</div>
                  </div>`
      search_list.append(html)
    }

    function appendUser(user) {  //チャットメンバーの表示
      var html = `<div class='chat-group-user clearfix js-chat-member' id='${ user.id }_list' >
                    <input name='group[user_ids][]' type='hidden' value='${ user.id }'>
                    <p class='chat-group-user__name'>${ user.name }</p>
                    <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn' id='${ user.id }_delete'>削除</div>
                  </div>`
      selected_list.append(html)
    }

    function appendErrMsgToHTML(msg) {
      var html = `<div class="chat-group-user clearfix">${ msg }</div>`
      search_list.append(html);
    }

    $("#user-search-field").on("keyup", function() {
      var input = $("#user-search-field").val();  //検索フォーム入力内容を取得
      
      $.ajax({
        type: 'GET',
        url: '/users',
        data: { keyword: input },
        dataType: 'json'
      })

      .done(function(users) {
        $("#user-search-result").empty();
        if (users.length !== 0) {
          users.forEach(function(user) {
            appendList(user);
            //検索リストで追加ボタンがクリックされたとき
            $(".chat-group-user.clearfix.search").on("click", `#${user.id}_add`, function() {  //ajaxで後から追加された要素にもイベントを発火させる際の記述方法
              appendUser(user);
              $(`#${user.id}_search`).remove();  //メンバーに追加されたユーザーを検索リストから削除
            });
          });
          
        } else {
          appendErrMsgToHTML("一致するユーザーがありません");
        }
      })

      .fail(function() {
        alert('ユーザー検索に失敗しました');
      })
    });

    //メンバーリストで削除ボタンがクリックされたとき
    $("#chat-group-users").on("click", ".js-remove-btn", function() {
      $(this).parent().remove();  //削除されたユーザーをメンバーリストから削除
    });
  });
});