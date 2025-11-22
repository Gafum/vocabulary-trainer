<?php
namespace App\Http\Requests;

// Validate input data for marking a word as learned or updating progress
class MarkWordRequest
{
    public function validate($data)
    {
        $errors = [];
        if (isset($data['learned']) && !is_bool($data['learned']) && !in_array($data['learned'], [0,1,'0','1'], true)) {
            $errors['learned'] = 'learned must be boolean';
        }
        if (isset($data['progress'])) {
            if (!is_numeric($data['progress'])) $errors['progress'] = 'progress must be numeric';
            else if ((int)$data['progress'] < 0 || (int)$data['progress'] > 100) $errors['progress'] = 'progress must be between 0 and 100';
        }
        return $errors;
    }
}
