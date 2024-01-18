(this.webpackJsonp=this.webpackJsonp||[]).push([[67],{54:function(e,r,n){"use strict";n.r(r),r.default=";; A basic parser and interpreter for infix mathematical expressions\n;; Example taken from: https://people.eecs.berkeley.edu/~bh/ssch18/trees.html\n\n\n(struct node (datum children))\n\n(define (parse expr)\n  (parse-helper expr '() '()))\n\n(define (parse-helper expr operators operands)\n  (cond ((null? expr)\n         (if (null? operators)\n             (car operands)\n             (handle-op '() operators operands)))\n        ((number? (car expr))\n         (parse-helper (cdr expr)\n                       operators\n                       (cons (node (car expr) '()) operands)))\n        ((list? (car expr))\n         (parse-helper (cdr expr)\n                       operators\n                       (cons (parse (car expr)) operands)))\n        (else (if (or (null? operators)\n                      (> (precedence (car expr))\n                         (precedence (car operators))))\n                  (parse-helper (cdr expr)\n                                (cons (car expr) operators)\n                                operands)\n                  (handle-op expr operators operands)))))\n\n(define (handle-op expr operators operands)\n  (parse-helper expr\n                (cdr operators)\n                (cons (node (car operators)\n                                 (list (cadr operands) (car operands)))\n                      (cddr operands))))\n\n(define (member? x los)\n  (cond\n    ((null? los) #f)\n    ((equal? x (car los)) #t)\n    (else (member? x (cdr los)))))\n\n\n(define (precedence oper)\n  (if (member? oper '(+ -))\n      1\n      2))\n\n\n(define (compute tree)\n  (if (number? (node-datum tree))\n      (node-datum tree)\n      ((function-named-by (node-datum tree))\n       (compute (car (node-children tree)))\n       (compute (cadr (node-children tree))))))\n\n(define (function-named-by oper)\n  (cond ((equal? oper '+) +)\n        ((equal? oper '-) -)\n        ((equal? oper '*) *)\n        ((equal? oper '/) /)\n        (else (error! \"no such operator as\" oper))))\n\n(compute (parse '(4 + 3 * 7 - 5 / (3 + 4) + 6))) ;; => 30.285714285714285\n(compute (parse '(1 + 2 + 3 + 4))) ;; => 10\n"}}]);