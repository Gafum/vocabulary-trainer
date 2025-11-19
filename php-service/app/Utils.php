<?php
namespace App;

class Utils
{
    // Basic HTML sanitizer for user-provided text
    public static function sanitizeHTML(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    // Basic safety check to reject inputs containing obvious SQL meta-characters or keywords
    public static function isSafeInput(string $input): bool
    {
        $needlePatterns = [
            '/;/',            // statement terminator
            '/--/',           // SQL comment
            '/\/\*/',       // start comment
            '/\bDROP\b/i',  // DROP keyword
            '/\bALTER\b/i',
            '/\bTRUNCATE\b/i',
        ];
        foreach ($needlePatterns as $pat) {
            if (preg_match($pat, $input)) return false;
        }
        return true;
    }
}
