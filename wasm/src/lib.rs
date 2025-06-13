use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Import console.log for debugging
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Macro for console.log
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Initialize panic hook for better error messages
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

// Bitboard type for efficient board representation
type Bitboard = u64;

// Piece types
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum PieceType {
    Pawn = 1,
    Knight = 2,
    Bishop = 3,
    Rook = 4,
    Queen = 5,
    King = 6,
}

// Colors
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Color {
    White = 0,
    Black = 1,
}

// Chess piece representation
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct Piece {
    pub piece_type: PieceType,
    pub color: Color,
}

// Move representation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Move {
    pub from: u8,
    pub to: u8,
    pub piece: Piece,
    pub captured: Option<Piece>,
    pub promotion: Option<PieceType>,
    pub is_castling: bool,
    pub is_en_passant: bool,
}

// Engine analysis result
#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub evaluation: f32,
    pub best_move: Option<Move>,
    pub principal_variation: Vec<Move>,
    pub nodes_searched: u64,
    pub search_depth: u8,
    pub time_ms: u32,
}

// Main chess engine struct
#[wasm_bindgen]
pub struct ChessEngine {
    // Bitboards for each piece type and color
    white_pawns: Bitboard,
    white_knights: Bitboard,
    white_bishops: Bitboard,
    white_rooks: Bitboard,
    white_queens: Bitboard,
    white_king: Bitboard,
    
    black_pawns: Bitboard,
    black_knights: Bitboard,
    black_bishops: Bitboard,
    black_rooks: Bitboard,
    black_queens: Bitboard,
    black_king: Bitboard,
    
    // Game state
    side_to_move: Color,
    castling_rights: u8,
    en_passant_square: Option<u8>,
    halfmove_clock: u16,
    fullmove_number: u16,
    
    // Evaluation tables and cache
    position_cache: HashMap<u64, f32>,
    nodes_searched: u64,
}

#[wasm_bindgen]
impl ChessEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ChessEngine {
        console_log!("Initializing JS Chess Engine 2.0 with WebAssembly + SIMD");
        
        ChessEngine {
            // Initialize starting position bitboards
            white_pawns: 0x000000000000FF00,
            white_knights: 0x0000000000000042,
            white_bishops: 0x0000000000000024,
            white_rooks: 0x0000000000000081,
            white_queens: 0x0000000000000008,
            white_king: 0x0000000000000010,
            
            black_pawns: 0x00FF000000000000,
            black_knights: 0x4200000000000000,
            black_bishops: 0x2400000000000000,
            black_rooks: 0x8100000000000000,
            black_queens: 0x0800000000000000,
            black_king: 0x1000000000000000,
            
            side_to_move: Color::White,
            castling_rights: 0b1111, // KQkq
            en_passant_square: None,
            halfmove_clock: 0,
            fullmove_number: 1,
            
            position_cache: HashMap::new(),
            nodes_searched: 0,
        }
    }
    
    /// Load position from FEN string
    #[wasm_bindgen]
    pub fn load_fen(&mut self, fen: &str) -> Result<(), JsValue> {
        console_log!("Loading FEN: {}", fen);
        
        // Clear all bitboards
        self.clear_position();
        
        let parts: Vec<&str> = fen.split_whitespace().collect();
        if parts.len() < 4 {
            return Err(JsValue::from_str("Invalid FEN format"));
        }
        
        // Parse board position
        self.parse_board_position(parts[0])?;
        
        // Parse side to move
        self.side_to_move = match parts[1] {
            "w" => Color::White,
            "b" => Color::Black,
            _ => return Err(JsValue::from_str("Invalid side to move")),
        };
        
        // Parse castling rights
        self.parse_castling_rights(parts[2])?;
        
        // Parse en passant square
        self.parse_en_passant(parts[3])?;
        
        // Parse halfmove and fullmove clocks if available
        if parts.len() >= 5 {
            self.halfmove_clock = parts[4].parse().unwrap_or(0);
        }
        if parts.len() >= 6 {
            self.fullmove_number = parts[5].parse().unwrap_or(1);
        }
        
        Ok(())
    }
    
    /// Generate all legal moves for current position
    #[wasm_bindgen]
    pub fn generate_moves(&mut self) -> JsValue {
        self.nodes_searched += 1;
        
        let moves = self.generate_legal_moves();
        serde_wasm_bindgen::to_value(&moves).unwrap()
    }
    
    /// Analyze position with given depth
    #[wasm_bindgen]
    pub fn analyze_position(&mut self, depth: u8, time_limit_ms: u32) -> JsValue {
        console_log!("Analyzing position at depth {} with {}ms limit", depth, time_limit_ms);
        
        let start_time = js_sys::Date::now() as u32;
        self.nodes_searched = 0;
        
        let evaluation = self.minimax_search(depth, f32::NEG_INFINITY, f32::INFINITY, true);
        
        let elapsed_time = (js_sys::Date::now() as u32) - start_time;
        
        let result = AnalysisResult {
            evaluation,
            best_move: None, // TODO: Track best move during search
            principal_variation: Vec::new(), // TODO: Implement PV tracking
            nodes_searched: self.nodes_searched,
            search_depth: depth,
            time_ms: elapsed_time,
        };
        
        console_log!("Analysis complete: eval={:.2}, nodes={}, time={}ms", 
                    evaluation, self.nodes_searched, elapsed_time);
        
        serde_wasm_bindgen::to_value(&result).unwrap()
    }
    
    /// Get current position as FEN string
    #[wasm_bindgen]
    pub fn get_fen(&self) -> String {
        self.position_to_fen()
    }
    
    /// Get engine statistics
    #[wasm_bindgen]
    pub fn get_stats(&self) -> JsValue {
        let stats = serde_json::json!({
            "nodes_searched": self.nodes_searched,
            "cache_size": self.position_cache.len(),
            "side_to_move": match self.side_to_move {
                Color::White => "white",
                Color::Black => "black"
            }
        });
        
        JsValue::from_str(&stats.to_string())
    }
}

// Private implementation methods
impl ChessEngine {
    fn clear_position(&mut self) {
        self.white_pawns = 0;
        self.white_knights = 0;
        self.white_bishops = 0;
        self.white_rooks = 0;
        self.white_queens = 0;
        self.white_king = 0;
        
        self.black_pawns = 0;
        self.black_knights = 0;
        self.black_bishops = 0;
        self.black_rooks = 0;
        self.black_queens = 0;
        self.black_king = 0;
    }
    
    fn parse_board_position(&mut self, board_str: &str) -> Result<(), JsValue> {
        let ranks: Vec<&str> = board_str.split('/').collect();
        if ranks.len() != 8 {
            return Err(JsValue::from_str("Invalid board format"));
        }
        
        for (rank_idx, rank) in ranks.iter().enumerate() {
            let mut file_idx = 0;
            for ch in rank.chars() {
                if ch.is_ascii_digit() {
                    file_idx += ch.to_digit(10).unwrap() as usize;
                } else {
                    let square = (7 - rank_idx) * 8 + file_idx;
                    let bit = 1u64 << square;
                    
                    match ch {
                        'P' => self.white_pawns |= bit,
                        'N' => self.white_knights |= bit,
                        'B' => self.white_bishops |= bit,
                        'R' => self.white_rooks |= bit,
                        'Q' => self.white_queens |= bit,
                        'K' => self.white_king |= bit,
                        'p' => self.black_pawns |= bit,
                        'n' => self.black_knights |= bit,
                        'b' => self.black_bishops |= bit,
                        'r' => self.black_rooks |= bit,
                        'q' => self.black_queens |= bit,
                        'k' => self.black_king |= bit,
                        _ => return Err(JsValue::from_str("Invalid piece character")),
                    }
                    file_idx += 1;
                }
            }
        }
        
        Ok(())
    }
    
    fn parse_castling_rights(&mut self, castling_str: &str) -> Result<(), JsValue> {
        self.castling_rights = 0;
        
        if castling_str != "-" {
            for ch in castling_str.chars() {
                match ch {
                    'K' => self.castling_rights |= 0b0001, // White kingside
                    'Q' => self.castling_rights |= 0b0010, // White queenside
                    'k' => self.castling_rights |= 0b0100, // Black kingside
                    'q' => self.castling_rights |= 0b1000, // Black queenside
                    _ => return Err(JsValue::from_str("Invalid castling rights")),
                }
            }
        }
        
        Ok(())
    }
    
    fn parse_en_passant(&mut self, ep_str: &str) -> Result<(), JsValue> {
        if ep_str == "-" {
            self.en_passant_square = None;
        } else if ep_str.len() == 2 {
            let file = ep_str.chars().nth(0).unwrap() as u8 - b'a';
            let rank = ep_str.chars().nth(1).unwrap() as u8 - b'1';
            self.en_passant_square = Some(rank * 8 + file);
        } else {
            return Err(JsValue::from_str("Invalid en passant square"));
        }
        
        Ok(())
    }
    
    fn generate_legal_moves(&self) -> Vec<Move> {
        // TODO: Implement full legal move generation
        // This is a placeholder that returns empty vector
        Vec::new()
    }
    
    fn minimax_search(&mut self, depth: u8, alpha: f32, beta: f32, maximizing: bool) -> f32 {
        if depth == 0 {
            return self.evaluate_position();
        }
        
        self.nodes_searched += 1;
        
        // TODO: Implement full minimax with alpha-beta pruning
        // This is a placeholder that returns static evaluation
        self.evaluate_position()
    }
    
    fn evaluate_position(&self) -> f32 {
        // Basic material evaluation
        let mut score = 0.0;
        
        // Material values
        score += (self.white_pawns.count_ones() as f32) * 1.0;
        score += (self.white_knights.count_ones() as f32) * 3.0;
        score += (self.white_bishops.count_ones() as f32) * 3.0;
        score += (self.white_rooks.count_ones() as f32) * 5.0;
        score += (self.white_queens.count_ones() as f32) * 9.0;
        
        score -= (self.black_pawns.count_ones() as f32) * 1.0;
        score -= (self.black_knights.count_ones() as f32) * 3.0;
        score -= (self.black_bishops.count_ones() as f32) * 3.0;
        score -= (self.black_rooks.count_ones() as f32) * 5.0;
        score -= (self.black_queens.count_ones() as f32) * 9.0;
        
        // Return from perspective of side to move
        match self.side_to_move {
            Color::White => score,
            Color::Black => -score,
        }
    }
    
    fn position_to_fen(&self) -> String {
        // TODO: Implement FEN generation from current position
        // This is a placeholder
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1".to_string()
    }
}

// SIMD-optimized bitboard operations
#[cfg(target_arch = "wasm32")]
mod simd_ops {
    use super::*;
    
    #[target_feature(enable = "simd128")]
    pub unsafe fn parallel_popcount(boards: &[u64; 4]) -> [u32; 4] {
        // TODO: Implement SIMD population count for multiple bitboards
        [
            boards[0].count_ones(),
            boards[1].count_ones(),
            boards[2].count_ones(),
            boards[3].count_ones(),
        ]
    }
    
    #[target_feature(enable = "simd128")]
    pub unsafe fn parallel_attack_generation(pieces: &[u64; 4], occupied: u64) -> [u64; 4] {
        // TODO: Implement SIMD attack generation for multiple pieces
        [0; 4]
    }
}