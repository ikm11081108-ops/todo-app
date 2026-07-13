// ==========================================
// HTMLの部品を取得する
// ==========================================
// document.getElementById() は、HTMLの中から
// 指定した id を持つ要素を1つ探してくる命令です。

const todoInput = document.getElementById("todo-input");     // 入力欄
const periodSelect = document.getElementById("period-select"); // 期間を選ぶプルダウン
const addButton = document.getElementById("add-button");     // 追加ボタン
const todoList = document.getElementById("todo-list");       // タスク一覧(ul)

// タブボタンを「1つの要素」ではなく「複数の要素の集まり」として取得する
// querySelectorAll は、条件に合う要素を全部まとめて取ってくる命令
const tabButtons = document.querySelectorAll(".tab-button");

// ==========================================
// タスクのデータを入れておく配列
// ==========================================
// 配列とは「複数のデータをまとめて入れておく箱」です。
// 1つ1つのタスクは { text: "内容", completed: false } という形の
// オブジェクト(データのまとまり)として保存します。
//
// 例: [
//   { text: "牛乳を買う", completed: false, period: "today" },
//   { text: "宿題をする", completed: true,  period: "week" }
// ]
// period(期間)には "today"(今日) / "week"(1週間) /
// "month"(1か月) / "year"(1年) のいずれかが入ります。

let todos = [];

// ==========================================
// 今、どのタブが選ばれているかを覚えておく変数
// ==========================================
// 最初は index.html 側で "today" タブに active クラスを
// つけているので、ここでも初期値を "today" にしておく

let currentFilter = "today";

// ==========================================
// 保存(localStorage)まわりの関数
// ==========================================
// localStorage は、ブラウザの中にデータを保存しておける機能です。
// これを使うと、ページを閉じたり再読み込みしても
// タスクが消えずに残るようになります。
// ※ 文字列しか保存できないので、JSON.stringify で
//    配列やオブジェクトを文字列に変換してから保存します。

function saveTodos() {
  // 配列 todos を文字列に変換して保存
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  // 保存されている文字列を取り出す
  const saved = localStorage.getItem("todos");

  if (saved) {
    // 保存されたデータがあれば、文字列を配列に戻す
    todos = JSON.parse(saved);

    // 期間機能を追加する前に保存された古いタスクには
    // period が存在しない場合がある。
    // その場合はどのタブにも表示されなくなってしまうので、
    // 念のため "today"(今日)を初期値として補っておく。
    todos.forEach(function (todo) {
      if (!todo.period) {
        todo.period = "today";
      }
    });
  }
}

// ==========================================
// 画面にタスク一覧を描画する関数
// ==========================================
// データ(todos配列)が変わるたびに、この関数を呼び出して
// 画面表示をまるごと作り直します。
// 「データを直接いじって、その結果を毎回画面に反映する」
// というのはよく使われる考え方です。

function renderTodos() {
  // まず一覧を空にする(前回の表示を消す)
  todoList.innerHTML = "";

  // todos配列の中から、今選ばれているタブ(currentFilter)と
  // period が一致するタスクだけを取り出す
  // filter() は「条件に合う要素だけを集めた新しい配列」を作る命令
  const filteredTodos = todos.filter(function (todo) {
    return todo.period === currentFilter;
  });

  // 絞り込んだ配列を1つずつ取り出して処理する
  filteredTodos.forEach(function (todo) {
    // filteredTodos の中での並び順ではなく、
    // 完了・削除の対象は「元のtodos配列」の何番目かで判断する必要がある。
    // そこで、元の配列の中での位置(index)を別途調べる。
    const index = todos.indexOf(todo);
    // --- <li> (1つのタスクの行)を作る ---
    const li = document.createElement("li");
    li.className = "todo-item";

    if (todo.completed) {
      // 完了しているタスクには "completed" クラスを追加
      // → style.css の取り消し線スタイルが自動的に適用される
      li.classList.add("completed");
    }

    // --- タスクの文字部分 <span> を作る ---
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    // タスクの文字をクリックしたら完了/未完了を切り替える
    span.addEventListener("click", function () {
      toggleComplete(index);
    });

    // --- 削除ボタン <button> を作る ---
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";

    deleteButton.addEventListener("click", function () {
      deleteTodo(index);
    });

    // <li> の中に <span> と <button> を入れる
    li.appendChild(span);
    li.appendChild(deleteButton);

    // <ul> の中に <li> を追加する
    todoList.appendChild(li);
  });
}

// ==========================================
// タスクを追加する関数
// ==========================================

function addTodo() {
  const text = todoInput.value.trim();
  // .trim() は文字列の前後の空白を取り除く命令。
  // これにより、空白だけ入力して追加してしまうのを防ぐ。

  if (text === "") {
    // 何も入力されていなければ何もしない
    return;
  }

  // プルダウンで選ばれている期間(today / week / month / year)を取得
  const period = periodSelect.value;

  // 新しいタスクを配列に追加する(period も一緒に保存)
  todos.push({ text: text, completed: false, period: period });

  todoInput.value = "";
  // 入力欄を空にして、次の入力をしやすくする

  saveTodos();   // 保存
  renderTodos(); // 画面を更新
}

// ==========================================
// タスクの完了状態を切り替える関数
// ==========================================

function toggleComplete(index) {
  // 指定した番号(index)のタスクの completed を
  // true ⇔ false に反転させる
  todos[index].completed = !todos[index].completed;

  saveTodos();
  renderTodos();
}

// ==========================================
// タスクを削除する関数
// ==========================================

function deleteTodo(index) {
  // splice(index, 1) は「index番目から1個」を配列から取り除く命令
  todos.splice(index, 1);

  saveTodos();
  renderTodos();
}

// ==========================================
// タブを切り替える関数
// ==========================================

function switchTab(period) {
  // 選ばれた期間を「今のフィルター」として覚えておく
  currentFilter = period;

  // すべてのタブボタンから active クラスをいったん外し、
  // クリックされたボタンにだけ active クラスを付け直す
  tabButtons.forEach(function (button) {
    if (button.dataset.period === period) {
      // dataset.period は、HTML側の data-period="◯◯" の値を読み取るもの
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  renderTodos(); // 選ばれた期間のタスクだけを表示し直す
}

// ==========================================
// イベント(操作)の登録
// ==========================================

// 「追加」ボタンをクリックしたときにaddTodoを実行
addButton.addEventListener("click", addTodo);

// 入力欄でのキー操作を制御する
// ・Enterキーだけ  → タスクを追加する(改行はしない)
// ・Shift + Enter → 改行する(追加はしない)
todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    // event.shiftKey は「Shiftキーが同時に押されているか」を表す値(true/false)。
    // Enterが押され、かつShiftが押されて"いない"ときだけ、この中に入る。

    event.preventDefault();
    // preventDefault() は「本来ブラウザが行うはずだった動作」を止める命令。
    // textareaのEnterキーは本来「改行を入力する」動作をするが、
    // それを止めることで、改行されずに次のaddTodo()だけが実行される。

    addTodo();
  }
  // Shift + Enter のときはこのif文に入らないため、
  // 何もせずブラウザ本来の動き(=改行)がそのまま行われる。
});

// 各タブボタンにクリックイベントを登録する
// tabButtons は複数の要素なので、forEach で1つずつ登録する
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    switchTab(button.dataset.period);
  });
});

// ==========================================
// ページを開いたときの初期処理
// ==========================================

loadTodos();   // 保存されていたタスクを読み込む
renderTodos(); // 読み込んだタスクを画面に表示する
