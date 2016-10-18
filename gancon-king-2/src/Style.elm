module Style exposing(..)


simpleBox =
  [ ("width", "100%")
  , ("margin-bottom", "10px")
  ]


errorBox =
  [ ("width", "100%")
  , ("padding", "5px 10px")
  , ("margin-bottom", "20px")
  ]


avilityBox =
  [ ("display", "inline-block")
  , ("padding", "2px 8px")
  , ("border-radius", "5px")
  ]


modal =
  [ ("position", "fixed")
  , ("top", "0px")
  , ("left", "0px")
  , ("width", "100%")
  , ("height", "100%")
  , ("background", "rgba(0,0,0,.5)")
  , ("transition", "all .1s linear")
  ]


modalContents =
  [ ("margin", "auto")
  , ("padding", "15px")
  , ("position", "absolute")
  , ("top", "0px")
  , ("bottom", "0px")
  , ("left", "0px")
  , ("right", "0px")
  , ("width", "80%")
  , ("height", "80%")
  , ("background", "white")
  ]


miniFont =
  [ ("font-size", ".7em") ]