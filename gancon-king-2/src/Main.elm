import Html exposing(..)
import Html.Attributes exposing(..)
import Html.Events exposing (..)
import Html.App exposing(program)
import Html.Lazy exposing (lazy, lazy2)
import String


import Style exposing(..)


main =
  program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- init


init : ( Model, Cmd Msg )
init =
  ( initialModel, Cmd.none )


-- Model


type alias Model =
  { cost : Cost
  , skill : Skill
  , attackNearPoint : Int
  , attackFarPoint : Int
  , defensePoint : Int
  , agilityPoint : Int
  , siegePoint : Int
  , intelliPoint : Int
  , modalVisibility : Bool
  }


type alias Cost =
  { value : Int
  , total : Int
  , limit : Int
  }


type alias Skill =
  { consumePoint : Int
  , isNew : Bool
  , name : String
  , desc : String
  }


initialModel : Model
initialModel =
  { cost = defaultCost
  , skill = defaultSkill
  , attackNearPoint = 0
  , attackFarPoint = 0
  , defensePoint = 0
  , agilityPoint = 0
  , siegePoint = 0
  , intelliPoint = 0
  , modalVisibility = False
  }


defaultCost : Cost
defaultCost =
  let
    maybeDefault = { value = 0, total = 0, limit = 0 }
  in
    List.head costs |> Maybe.withDefault maybeDefault


defaultSkill : Skill
defaultSkill =
  let
    maybeDefault = { consumePoint = 0, isNew = False, name = "", desc = "" }
  in
    List.head skills |> Maybe.withDefault maybeDefault


computeRestPoint : Model -> Int
computeRestPoint model =
  model.cost.total - (model.skill.consumePoint + model.attackNearPoint + model.attackFarPoint + model.defensePoint + model.agilityPoint + model.siegePoint + model.intelliPoint)


costs : List Cost
costs =
  [ { value = 7, total = 120, limit = 40 }
  , { value = 8, total = 165, limit = 55 }
  , { value = 9, total = 195, limit = 65 }
  , { value = 10, total = 225, limit = 75 }
  , { value = 11, total = 240, limit = 80 }
  ]


skills : List Skill
skills =
  [ { consumePoint = 20
    , isNew = True
    , name = "装甲演算強化【減衰】Ⅰ"
    , desc = "【パッシブ】【合成習得不可】常に装甲と演算力を大きく増加させる。さらに通常攻撃が、攻撃対象に攻撃力減少効果を付与するようになる。"
    }
  , { consumePoint = 20
    , isNew = True
    , name = "後衛優先攻撃付与【自身】Ⅰ"
    , desc = "【パッシブ】【合成習得不可】通常攻撃が後衛優先攻撃になる。さらに常に攻撃力を増加させる。《スキルタイプ：通常攻撃変化》「通常攻撃変化」のスキルタイプを持つスキルは、機体1体につき1つまでしか習得できない。"
    }
  , { consumePoint = 15
    , isNew = False
    , name = "攻撃演算強化【奮起自身】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、自身のパッシブスキル以外のパラメーター減少効果を解除する。さらに攻撃力増加効果と演算力増加効果を付与する。効果は3ターン持続する。"
    }
  , { consumePoint = 20
    , isNew = False
    , name = "装甲演算強化【挑発】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、自身に装甲増加効果と演算力増加効果を付与する。さらに、自身に優先的に敵のスキルや通常攻撃のターゲットとなる効果を付与する。効果は3ターン持続する。"
    }
  , { consumePoint = 10
    , isNew = False
    , name = "機動AS強化【刹那全体】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、味方全員に機動力増加効果とアクティブスキル発動率増加効果を確率で付与する。判定は1体毎に行う。（対象のスキル発動率を効果量の割合だけ増加させる）効果は1ターン持続する。"
    }
  , { consumePoint = 10
    , isNew = False
    , name = "演算機動強化【速攻自身】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、自身に機動力増加効果と演算力増加効果を付与する。さらに、自身に先制攻撃効果を付与する。パラメーター増加効果は3ターン持続する。"
    }
  , { consumePoint = 10
    , isNew = False
    , name = "演算AS発動率弱体【全体】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、敵全員に演算力減少効果とアクティブスキル発動率減少効果を確率で付与する。（対象のスキル発動率を効果量の割合だけ減少させる）判定は1体毎に行う。効果は3ターン持続する。"
    }
  , { consumePoint = 15
    , isNew = True
    , name = "装甲機動強化抑制【狙撃】Ⅰ"
    , desc = "【スタートアップ】【合成習得不可】戦闘開始時、装甲の高い敵を狙い装甲増加効果を抑制する。さらに、機動力の高い敵を狙い機動力増加効果を抑制する。効果は1ターン持続する。"
    }
  , { consumePoint = 20
    , isNew = True
    , name = "支援攻撃Ⅳ"
    , desc = "【アクティブ】【合成習得不可】1ターンの間、前列に配置された自分以外の味方全員の装甲と演算力を増加させる。さらに、次のターンの自身の行動まで、前列に配置された味方機体が通常攻撃を行うと、自身も攻撃を行うようになる。"
    }
  , { consumePoint = 15
    , isNew = False
    , name = "全力攻撃Ⅱ"
    , desc = "【アクティブ】【合成習得不可】自身の前後左右に配置された味方の攻撃力と機動力を増加させ、アクティブスキル発動率増加効果を付与する。（対象のスキル発動率を効果量の割合だけ増加させる）効果は2ターン持続する。さらに敵1体に攻撃を行う。"
    }
  , { consumePoint = 20
    , isNew = False
    , name = "攻撃機動強化【集中周囲】Ⅰ"
    , desc = "【アクティブ】【合成習得不可】自身の前後左右に配置された味方の攻撃力と機動力を増加させ、アクティブスキル発動率増加効果を付与する。（対象のスキル発動率を効果量の割合だけ増加させる）効果は2ターン持続する。さらに敵1体に攻撃を行う。"
    }
  , { consumePoint = 10
    , isNew = False
    , name = "強化攻撃【熔融】Ⅰ"
    , desc = "【アクティブ】【合成習得不可】攻撃力を大きく増加させて攻撃を行い、HP減少効果を付与する。さらにその前後左右の敵にHP減少効果を付与する。（HP減少効果によるダメージ量は、効果付与時の自身のHPと対象のHPに大きく依存する）効果は4ターン持続する。"
    }
  , { consumePoint = 15
    , isNew = False
    , name = "縦列攻撃【装甲侵徹】Ⅰ"
    , desc = "【アクティブ】【合成習得不可】1,3,5,7ターン目に発動する。攻撃力を大きく増加させ、装甲をわずかに無視して薙ぎ払い攻撃を行う。（攻撃対象の装甲を効果量の割合だけ無視する）スキル発動後2ターンの間、使用者のアクティブスキル発動率が50%減少する。（対象のスキル発動率を効果量の割合だけ減少させる）"
    }
  , { consumePoint = 15
    , isNew = False
    , name = "強スタン攻撃【強敵狙撃】Ⅰ"
    , desc = "【アクティブ】【合成習得不可】攻撃力の高い敵を狙う。攻撃力を増加させて攻撃を行う。さらに対象に強スタン効果を付与する。（2ターンの間行動不能になる）"
    }
  , { consumePoint = 5
    , isNew = True
    , name = "オーバーパワー【全域】Ⅰ"
    , desc = "【アクティブ】【合成習得不可】1,2ターン目に発動し、敵味方全員に攻撃力増加効果と装甲弱体効果を確率で付与する。判定は1体毎に行う。効果は3ターン持続する。《スキルタイプ：指定ターン発動》「指定ターン発動」のスキルタイプを持つスキルは、機体1体に複数習得させた場合、同じターンに1つしか発動しない。"
    }
  ]


-- Update


type Msg
  = ChangedCost String
  | ChangedSkill String
  | InputAttackNear String
  | InputAttackFar String
  | InputDefense String
  | InputAgility String
  | InputSeage String
  | InputIntelli String
  | Clear
  | ShowModal
  | HideModal


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    ChangedCost newCost ->
      { model | cost = selectCost newCost } ! []

    ChangedSkill newSkill ->
      { model | skill = selectSkill newSkill } ! []

    InputAttackNear newPoint ->
      { model | attackNearPoint = pointTextToInt newPoint model.attackNearPoint } ! []

    InputAttackFar newPoint ->
      { model | attackFarPoint = pointTextToInt newPoint model.attackFarPoint } ! []

    InputDefense newPoint ->
      { model | defensePoint = pointTextToInt newPoint model.defensePoint } ! []

    InputAgility newPoint ->
      { model | agilityPoint = pointTextToInt newPoint model.agilityPoint } ! []

    InputSeage newPoint ->
      { model | siegePoint = pointTextToInt newPoint model.siegePoint } ! []

    InputIntelli newPoint ->
      { model | intelliPoint = pointTextToInt newPoint model.intelliPoint } ! []

    Clear ->
      initialModel ! []

    ShowModal ->
      { model | modalVisibility = True } ! []

    HideModal ->
      { model | modalVisibility = False } ! []


pointTextToInt : String -> Int -> Int
pointTextToInt pointText defaultPoint =
  String.toInt pointText
    |> Result.toMaybe
    |> Maybe.withDefault defaultPoint


selectCost : String -> Cost
selectCost costText =
  let
    cost = String.toInt costText |> Result.toMaybe |> Maybe.withDefault 0
    selectedCost = List.head <| List.filter (\c -> c.value == cost) costs
  in
    case selectedCost of
      Just a -> a
      Nothing -> defaultCost


selectSkill : String -> Skill
selectSkill skillText =
  let
    selectedSkill = List.head <| List.filter (\s -> s.name == skillText) skills
  in
    case selectedSkill of
      Just a -> a
      Nothing -> defaultSkill


-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- View


view : Model -> Html Msg
view model =
  div
    [ class "mui-panel" ]
    [ lazy restPointField <| computeRestPoint model
    , lazy costField model.cost
    , lazy skillField model.skill
    , lazy inputAttackNearPoint model.attackNearPoint
    , lazy2 validationField model.attackNearPoint model.cost.limit
    , lazy inputAttackFarPoint model.attackFarPoint
    , lazy2 validationField model.attackFarPoint model.cost.limit
    , lazy inputDefensePoint model.defensePoint
    , lazy2 validationField model.defensePoint model.cost.limit
    , lazy inputAgilityPoint model.agilityPoint
    , lazy2 validationField model.agilityPoint model.cost.limit
    , lazy inputSeagePoint model.siegePoint
    , lazy2 validationField model.siegePoint model.cost.limit
    , lazy inputIntelliPoint model.intelliPoint
    , lazy2 validationField model.intelliPoint model.cost.limit
    , submitField
    , lazy modalView model
    ]


restPointField : Int -> Html Msg
restPointField restPoint =
  let
    restPointFieldClass =
      if restPoint < 0 then
        "mui--text-subhead mui--text-danger"
      else
        "mui--text-subhead mui--text-dark"
  in
    div
      [ class restPointFieldClass, style simpleBox ]
      [ span [] [ text "残ポイント：" ]
      , span [] [ text <| toString restPoint ]
      ]


costField : Cost -> Html Msg
costField cost =
  let
    optionBuilder = \c ->
      option
        [ value <| toString c.value, selected (c.value == cost.value) ]
        [ text <| toString c.value ]
  in
    div
      [ class "mui-select" ]
      [ select [ onInput ChangedCost ] <| List.map optionBuilder costs
      , label [] [ text "コスト" ]
      ]


skillField : Skill -> Html Msg
skillField skill =
  let
    optionBuilder = \s ->
      option
        [ value s.name, selected (s.name == skill.name) ]
        [ text s.name ]
  in
    div
      []
      [ div
          [ class "mui-select" ]
          [ select [ onInput ChangedSkill ] <| List.map optionBuilder skills
          , label [] [ text "スキル" ]
          ]
      , div [ class "mui-panel", style miniFont ] [ text skill.desc ]
      ]


inputAttackNearPoint : Int -> Html Msg
inputAttackNearPoint point =
  inputField "近接" (avility point 40 1600) point InputAttackNear


inputAttackFarPoint : Int -> Html Msg
inputAttackFarPoint point =
  inputField "遠隔" (avility point 40 1600) point InputAttackFar


inputDefensePoint : Int -> Html Msg
inputDefensePoint point =
  inputField "装甲" (avility point 37 1600) point InputDefense


inputAgilityPoint : Int -> Html Msg
inputAgilityPoint point =
  inputField "機動力" (avility point 1 150) point InputAgility


inputSeagePoint : Int -> Html Msg
inputSeagePoint point =
  inputField "占拠力" (avility point 1 30) point InputSeage


inputIntelliPoint : Int -> Html Msg
inputIntelliPoint point =
  inputField "演算力" (avility point 1 100) point InputIntelli


submitField : Html Msg
submitField =
  div
    []
    [ button
        [ class "mui-btn mui-btn--small mui-btn--raised"
        , onClick Clear
        ]
        [ text "クリア" ]
    , button
        [ class "mui-btn mui-btn--small mui-btn--primary mui-btn--raised"
        , onClick ShowModal
        ]
        [ text "確認" ]
    ]


inputField : String -> String -> Int -> (String -> Msg) -> Html Msg
inputField labelText avility point msg =
  div
    []
    [ div
        []
        [ span
            [ class "mui--bg-primary-dark mui--text-white", style avilityBox ]
            [ text <| labelText ++ " " ++ (toString avility) ]
        ]
    , div
      [ class "mui-textfield" ]
      [ input
          [ type' "number"
          , Html.Attributes.min "0"
          , value <| toString point
          , onInput msg
          ]
          []
      ]
    ]


validationField : Int -> Int -> Html Msg
validationField point limit =
  let
    display = if point > limit then "inline-block" else "none"
  in
    div
      [ class "mui--bg-danger mui--text-white"
      , style <| ("display", display) :: errorBox
      ]
      [ span [] [ text "振り分けポイントオーバー" ] ]


avility : Int -> Int -> Int -> String
avility point rate base = (rate * point) + base |> toString


-- ModalView


modalView : Model -> Html Msg
modalView model =
  let
    visibility = if model.modalVisibility then "visible" else "hidden"
    opacity = if model.modalVisibility then "1" else "0"
    modalStyles = ("opacity", opacity) :: ("visibility", visibility) :: modal
  in
    div
      [ style modalStyles, onClick HideModal ]
      [ div
          [ style modalContents ]
          [ div [] [ text <| "コスト" ++ (toString model.cost.value) ]
          , avilityTable model
          , restPointValidationRow <| computeRestPoint model
          ]
      ]

avilityTable : Model -> Html Msg
avilityTable model =
  table
    [ class "mui-table mui-table--bordered" ]
    [ thead
        []
        [ tr
            []
            [ th [ class "mui--text-right", style miniFont ] [ text "" ]
            , th [ class "mui--text-right", style miniFont ] [ text "パラメーター" ]
            , th [ class "mui--text-right", style miniFont ] [ text "加算ポイント" ]
            ]
        ]
    , tbody
        []
        [ avilityTableRow "近接" model.attackNearPoint model.cost.limit 40 1600
        , avilityTableRow "遠隔" model.attackFarPoint model.cost.limit 40 1600
        , avilityTableRow "装甲" model.defensePoint model.cost.limit 37 1600
        , avilityTableRow "機動力" model.agilityPoint model.cost.limit 1 150
        , avilityTableRow "占拠力" model.siegePoint model.cost.limit 1 30
        , avilityTableRow "演算力" model.intelliPoint model.cost.limit 1 100
        , skillTableRow model.skill
        , avilityTotalRow model
        ]
    ]


avilityTableRow : String -> Int -> Int -> Int -> Int -> Html Msg
avilityTableRow name point limit rate base =
  let
    avilityText = toString <| avility point rate base

    pointText = "+" ++ (toString point)

    accentStyle =
      if point > limit then
        ("color", "red")
      else if point > 0 then
        ("color", "#2196F3")
      else
        ("color", "")
  in
    tr
      []
      [ td [ style miniFont ] [ text name ]
      , td [ class "mui--text-right", style <| accentStyle :: miniFont ] [ text avilityText ]
      , td [ class "mui--text-right", style miniFont ] [ text pointText ]
      ]


skillTableRow : Skill -> Html Msg
skillTableRow skill =
  tr
    []
    [ td [ style miniFont ] [ text "スキル" ]
    , td [ class "mui--text-right", style miniFont ] [ text skill.name ]
    , td [ class "mui--text-right", style miniFont ] [ text <| "+" ++ (toString skill.consumePoint) ]
    ]


avilityTotalRow : Model -> Html Msg
avilityTotalRow model =
  let
    totalPoint
      = model.attackNearPoint
      + model.attackFarPoint
      + model.defensePoint
      + model.agilityPoint
      + model.siegePoint
      + model.intelliPoint
      + model.skill.consumePoint

    statusColor =
      if totalPoint == model.cost.total then
        ("color", "#2196F3")
      else if totalPoint > model.cost.total then
        ("color", "red")
      else
        ("color", "#BBDEFB")
  in
    tr
      []
      [ td [ style miniFont ] []
      , td [ class "mui--text-right", style miniFont ] []
      , td [ class "mui--text-right", style <| statusColor :: miniFont ] [ text <| toString totalPoint ]
      ]


restPointValidationRow : Int -> Html Msg
restPointValidationRow restPoint =
  let
    (message, colorStyle) =
      if restPoint < 0 then
        ((toString <| abs restPoint) ++ "ポイントオーバーです。", ("color", "red"))
      else if restPoint > 0 then
        ("あと" ++ (toString restPoint) ++ "ポイント加算出来ます。", ("color", "#BBDEFB"))
      else
        ("ポイントをピッタリ使い切りました( ･∀･)=b", ("color", "#2196F3"))
  in
    div [ class "mui--text-center", style <| colorStyle :: miniFont ] [ text message ]
