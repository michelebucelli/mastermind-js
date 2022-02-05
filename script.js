// GAME PARAMETERS /////////////////////////////////////////////////////////////

// Length of the code to be guessed.
const code_length = 4;

// Maximum number of allowed guesses.
const n_max_guesses = 10;

// Number of colors.
const n_colors = 8;

// Allow repetitions.
const allow_repetitions = true;

// ENUMERATIONS ////////////////////////////////////////////////////////////////

// GRAPHICAL PARAMETERS ////////////////////////////////////////////////////////

// Size of a pixel [px].
const pixel_size = 4;

// Size of a grid element [px].
const grid_size = 48;

// Spacing of grid elements [px].
const grid_spacing = 8;

// Colors.
let colors = [
  "#FF595E", "#FF924C", "#FFCA3A", "#8AC926", "#52A675", "#1982C4", "#385894",
  "#6A4C93"
];

// Color for an empty guess.
let color_empty = "#1C1528";

// Color for correct guesses in the correct place.
let color_correct_place = "#FF595E";

// Color for correct guesses in the wrong place.
let color_wrong_place = "#FFCA3A";

// BITMAP FONT /////////////////////////////////////////////////////////////////

const bitfont_alphabet = [
  "|", "%", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "a",
  "c", "e", "g", "h", "i", "l", "m", "o", "r", "s", "t", "v", "."
];
const bitfont_characters = [
  [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], // |
  [ 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1 ], // %
  [ 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // 0
  [ 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 ], // 1
  [ 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1 ], // 2
  [ 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1 ], // 3
  [ 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1 ], // 4
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // 5
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1 ], // 6
  [ 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1 ], // 7
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1 ], // 8
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // 9
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // <space>
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1 ], // a
  [ 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1 ], // c
  [ 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1 ], // e
  [ 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // g
  [ 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1 ], // h
  [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 ], // i
  [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1 ], // l
  [ 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1 ], // m
  [ 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1 ], // o
  [ 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1 ], // r
  [ 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1 ], // s
  [ 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0 ], // t
  [ 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0 ], // v
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ]  // .
];
const bitfont_kerning = [
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
  0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2
];

let BitmapFont = function(alphabet, characters, kerning, w, h, pixel_size) {
  this.alphabet = alphabet;     // Font alphabet.
  this.characters = characters; // Font characters.
  this.kerning = kerning;       // Kerning.
  this.w = w;                   // Font width.
  this.h = h;                   // Font height.
  this.pixel_size = pixel_size;

  // Render a single character in given position.
  this.render_character = function(context, x, y, char, color) {
    let alphabet_idx = this.alphabet.indexOf(char);
    if (alphabet_idx < 0)
      return 0;

    let bit_char = this.characters[alphabet_idx];

    context.fillStyle = color;
    for (let row = 0; row < this.h; ++row)
      for (let col = 0; col < this.w; ++col)
        if (bit_char[row * this.w + col])
          context.fillRect(x + col * pixel_size, y + row * pixel_size,
                           pixel_size, pixel_size);

    return this.w - this.kerning[alphabet_idx];
  };

  // Render a string starting from given position.
  this.render_string = function(context, x, y, string, color) {
    let cur_x = x;
    let dx;
    for (let i = 0; i < string.length; ++i) {
      dx = this.render_character(context, cur_x, y, string.charAt(i), color);
      cur_x += (dx + 1) * this.pixel_size;
    }
  };

  // Compute the width of a character without actually rendering it.
  this.char_width = function(char) {
    let alphabet_idx = this.alphabet.indexOf(char);
    if (alphabet_idx < 0)
      return 0;

    else
      return (this.w - this.kerning[alphabet_idx]) * this.pixel_size;
  };

  // Compute the width of a string without actually rendering it.
  this.string_width = function(string) {
    let w = 0;
    for (let i = 0; i < string.length; ++i)
      w += this.char_width(string.charAt(i)) + this.pixel_size;
    w -= this.pixel_size;
    return w;
  };
};

// GAME LOGIC //////////////////////////////////////////////////////////////////

let Game = function() {
  // Setup guesses and answers grid.
  this.guesses = [];
  this.answers = [];

  for (let i = 0; i < n_max_guesses; ++i) {
    this.guesses.push([]);
    this.answers.push([ 0, 0 ]);

    for (let j = 0; j < code_length; ++j)
      this.guesses[i].push(-1);
  }

  // Generate the secret code.
  this.code = [];
  let options = [];
  for (let i = 0; i < n_colors; ++i)
    options.push(i);

  for (let i = 0; i < code_length; ++i) {
    let k = Math.floor(Math.random() * options.length);
    this.code.push(options[k]);

    if (!allow_repetitions)
      options.splice(k, 1);
  }

  // Number of currently submitted guesses.
  this.submitted = 0;

  // Setup all possible combinations.
  this.valid_combinations = [ Array(code_length).fill(0) ];
  for (let i = 1; i < Math.pow(n_colors, code_length); ++i) {
    this.valid_combinations[i] = this.valid_combinations[i - 1].slice(0);

    ++this.valid_combinations[i][0];
    for (let j = 0; j < code_length - 1; ++j)
      if (this.valid_combinations[i][j] >= n_colors) {
        this.valid_combinations[i][j] = 0;
        ++this.valid_combinations[i][j + 1];
      }
  }

  // Remove combinations with repetitions, if needed.
  if (!allow_repetitions) {
    for (let i = 0; i < this.valid_combinations.length; ++i) {
      let unique = this.valid_combinations[i].filter(
          (color, idx, self) => self.indexOf(color) === idx);

      if (unique.length < code_length) {
        this.valid_combinations.splice(i, 1);
        --i;
      }
    }
  }

  // Score.
  this.score = 0;

  // Insert color in next guess.
  this.insert_color = function(color) {
    let free_slot = 0;
    for (; free_slot < code_length; ++free_slot)
      if (this.guesses[this.submitted][free_slot] < 0)
        break;

    if (free_slot < code_length)
      this.guesses[this.submitted][free_slot] = color;
  };

  // Remove color from next guess.
  this.remove_color = function() {
    let last_color;
    for (last_color = code_length - 1; last_color >= 0; --last_color)
      if (this.guesses[this.submitted][last_color] >= 0)
        break;

    if (last_color >= 0)
      this.guesses[this.submitted][last_color] = -1;
  };

  // Count correct and incorrect colors for given guess.
  this.count_correct = function(guess, code) {
    let guess_to_check = Array(code_length).fill(true);
    let code_to_check = Array(code_length).fill(true);
    let answer = [ 0, 0 ];

    // First, count the number of correct colors in the correct place.
    for (let i = 0; i < code_length; ++i)
      if (guess[i] == code[i]) {
        guess_to_check[i] = false;
        code_to_check[i] = false;
        ++answer[0];
      }

    // Then, count the number of correct colors in the wrong place.
    for (let i = 0; i < code_length; ++i) {
      if (!guess_to_check[i])
        continue;

      for (let j = 0; j < code_length; ++j) {
        if (!code_to_check[j])
          continue;

        if (guess[i] == code[j]) {
          guess_to_check[i] = false;
          code_to_check[j] = false;
          ++answer[1];

          break;
        }
      }
    }

    return answer;
  };

  // Validate current guess and move on to next one.
  this.validate = function() {
    // Check that the submitted guess is full, and do nothing otherwise.
    for (let i = 0; i < code_length; ++i)
      if (this.guesses[this.submitted][i] < 0)
        return;

    this.answers[this.submitted] =
        this.count_correct(this.guesses[this.submitted], this.code);

    // Now we remove from the valid_combinations array all those that are not
    // compatible with what we obtained.
    let old_combinations = this.valid_combinations.length;

    for (let i = 0; i < this.valid_combinations.length; ++i) {
      let answer = this.count_correct(this.guesses[this.submitted],
                                      this.valid_combinations[i]);

      if (answer[0] != this.answers[this.submitted][0] ||
          answer[1] != this.answers[this.submitted][1]) {
        this.valid_combinations.splice(i, 1);
        --i;
      }
    }

    let new_combinations = this.valid_combinations.length;

    // Score is increased proportionally the number of combinations you
    // excluded, squared.
    if (old_combinations > new_combinations ||
        (old_combinations == 1 &&
         this.answers[this.submitted][0] == code_length))
      this.score += Math.pow(old_combinations / new_combinations, 2);
    else
      this.score = Math.max(0, this.score - 100);

    console.log(this.valid_combinations.length +
                " valid guesses remaining, new score " + this.score);

    // Next guess.
    ++this.submitted;
  };

  // Draw on canvas.
  this.draw = function(context) {
    let total_width = (grid_size + grid_spacing) * code_length - grid_spacing;
    let total_height =
        (grid_size + grid_spacing) * n_max_guesses - grid_spacing;

    context.fillStyle = "#130E1B";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.save();
    context.translate((context.canvas.width - total_width) / 2,
                      (context.canvas.height - total_height) / 2);

    for (let i = 0; i < n_max_guesses; ++i) {
      // Draw guesses.
      for (let j = 0; j < code_length; ++j) {
        if (this.guesses[i][j] >= 0)
          context.fillStyle = colors[this.guesses[i][j]];
        else
          context.fillStyle = color_empty;

        context.fillRect(j * (grid_size + grid_spacing),
                         total_height - i * (grid_size + grid_spacing) -
                             grid_size,
                         grid_size, grid_size);
      }

      // Draw answers.
      if (i < this.submitted) {
        for (let j = 0; j < code_length; ++j) {
          context.fillStyle =
              j < this.answers[i][0] ? color_correct_place : color_empty;
          context.fillRect((grid_size + grid_spacing) * code_length -
                               grid_spacing + pixel_size + 2 * pixel_size * j,
                           total_height - i * (grid_size + grid_spacing) -
                               pixel_size,
                           pixel_size, pixel_size);
        }

        for (let j = 0; j < code_length; ++j) {
          context.fillStyle =
              j < this.answers[i][1] ? color_wrong_place : color_empty;
          context.fillRect((grid_size + grid_spacing) * code_length -
                               grid_spacing + pixel_size + 2 * pixel_size * j,
                           total_height - i * (grid_size + grid_spacing) -
                               3 * pixel_size,
                           pixel_size, pixel_size);
        }
      }
    }

    bitfont.render_string(context, 0,
                          total_height -
                              (n_max_guesses - 1) * (grid_size + grid_spacing) -
                              grid_size - bitfont.h * pixel_size - grid_spacing,
                          "score " + Math.round(game.score), "#6A4C93");

    context.restore();
  };
};

// GAME FLOW CONTROL ///////////////////////////////////////////////////////////

let main_canvas = 0;  // Game canvas.
let main_context = 0; // Game canvas 2D context.

let game = 0;

// Bitmap font.
let bitfont = new BitmapFont(bitfont_alphabet, bitfont_characters,
                             bitfont_kerning, 3, 5, pixel_size);

// Setup method.
let setup = function() {
  // Retrieve canvas elements.
  main_canvas = document.getElementById("main-canvas");
  main_context = main_canvas.getContext("2d");

  // Setup game.
  game = new Game();

  // Register keydown events for player movement.
  document.onkeydown = function(e) {
    if (0 < parseInt(e.key) && parseInt(e.key) <= n_colors) {
      game.insert_color(e.key - 1);
      game.draw(main_context);
    } else if (e.code === "Backspace") {
      game.remove_color();
      game.draw(main_context);
    } else if (e.code === "Enter" || e.code === "Space") {
      game.validate();
      game.draw(main_context);
    }
  };

  game.draw(main_context);

  // Draw the help.
  {
    let help_canvas = document.getElementById("help-canvas");
    let help_context = help_canvas.getContext("2d");
    let total_width = n_colors * (grid_size + grid_spacing) - grid_spacing;

    help_context.save();
    help_context.translate((help_canvas.width - total_width) / 2, 0);

    for (let i = 0; i < n_colors; ++i) {
      help_context.fillStyle = colors[i];
      help_context.fillRect(i * (grid_size + grid_spacing), 0, grid_size,
                            grid_size);

      let char = "" + (i + 1);
      let char_w = bitfont.char_width(char);
      let char_h = bitfont.h * bitfont.pixel_size;

      bitfont.render_character(help_context,
                               i * (grid_size + grid_spacing) +
                                   (grid_size - char_w) / 2,
                               (grid_size - char_h) / 2, char, "#130E1B");
    }

    help_context.restore();
  }
};
