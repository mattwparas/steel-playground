(this.webpackJsonp=this.webpackJsonp||[]).push([[78],{65:function(n,a,t){"use strict";t.r(a),a.default="(define (push element)\n  (lambda (stack)\n    (list '() (cons element stack))))\n\n(define (pop)\n  (lambda (stack)\n    (let ((element (car stack))\n          (new-stack (cdr stack)))\n      (list element new-stack))))\n\n(define stack-of cadr)\n(define value-of car)\n\n(define (>>= stack-action continuation)\n  (lambda (stack)\n    (let ((result (stack-action stack)))\n      ((continuation (value-of result)) (stack-of result)))))\n\n(define (return value)\n  (lambda (stack)\n    (list value stack)))\n\n(define (run-stack computation stack)\n  (computation stack))\n\n(define (eval-stack computation stack)\n  (value-of (computation stack)))\n\n(define (exec-stack computation stack)\n  (stack-of (computation stack)))\n\n(define computation-1 (>>= (push 4) (lambda (_)\n                      (>>= (push 5) (lambda (_)\n                      (>>= (pop)    (lambda (a)\n                      (>>= (pop)    (lambda (b)\n                      (return (list a b)))))))))))\n\n(define computation-2 (>>= (push 2) (lambda (_)\n                      (>>= (push 3) (lambda (_)\n                      (>>= (pop)    (lambda (a)\n                      (>>= (pop)    (lambda (b)\n                      (return (list a b)))))))))))\n\n(define (main)\n  (let ((initial-stack '())\n        (composed (>>= computation-1 \n                      (lambda (a)\n                        (>>= computation-2 \n                             (lambda (b)\n                                (return (list a b))))))))\n    (begin\n      (define result (eval-stack composed initial-stack))\n      (displayln \"Result: \" result)\n      result)))\n\n(main)"}}]);